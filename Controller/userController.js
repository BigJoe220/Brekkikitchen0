const userModels = require('../Models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { signUpTemplate, resendVerificationTemplate, resetPasswordTemplate } = require('../utiles/emailTamplate')
const emailSender = require('../middlewares/nodemailer')


exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, password } = req.body

        const userExist = await userModels.findOne({ email: email.toLowerCase() });
        if (userExist) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }

        const saltedRounds = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, saltedRounds)

        const otp = Math.round(Math.random() * 1e4)
            .toString()
            .padStart(4, '0')

        const user = new userModels({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phoneNumber,
            password: hashPassword,
            otp: otp,
            otpExpired: Date.now() + 1000 * 60
        });
        await user.save();

        const emailOption = {
            email: user.email,
            subject: "VERIFY EMAIL",
            html: signUpTemplate(otp, user.firstName)
        }
        // send the email to the user
        await emailSender(emailOption);

        res.status(201).json({
            message: 'signUp successfully',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.verifyUser = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(otp);

        const user = await userModels.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }
        if (Date.now() > user.otpExpired) {
            return res.status(400).json({
                message: 'OTP Expired'
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                message: 'Invalid otp'
            })
        }

        user.isVerified = true,
            user.otp = null;
        user.otpExpired = null;
        await user.save()

        res.status(200).json({
            message: 'User verified'
        })
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(500).json({
                message: 'Session expired, please resend verification'
            })
        }
        return res.status(500).json({
            message: 'Error veriying user',
            data: error.message
        })
    }
}
exports.resendVerification = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await userModels.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const otp = Math.round(Math.random() * 1e4)
            .toString()
            .padStart(4, '0');
        user.otp = otp;
        user.otpExpired = Date.now() + 1000 + 60
        await user.save();
        const options = {
            email: user.email,
            subject: 'Verification Email',
            html: resendVerificationTemplate(otp, user.firstName)
        }
        await emailSender(options)
        res.status(200).json({
            message: 'verification email sent successfully please check your email to verify.'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModels.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(404).json({
                message: 'user not found'
            })
        }

        const passwordCorrect = await bcrypt.compare(password, user.password)
        if (passwordCorrect === false) {
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
        if (user.isVerified === false) {
            return res.status(401).json({
                message: 'User not verified check your email for verification link'
            })
        }
        if (user.isLoggedIn === true) {
            return res.status(401).json({
                message: 'User is already logged in'
            })
        };

        user.isLoggedIn = true;
        const token = jwt.sign({
            email: user.email,
            id: user._id,
        }, process.env.JWT_SECRET, { expiresIn: '10mins' });

        res.status(200).json({
            message: 'Login successful',
            data: user,
            token
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.resetPassword = async (req, res) => {
    try {
        const {email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Password does not match'
            })
        }

        const user = await userModels.findOne({email: email.toLowerCase()})
        if (!user) {

            res.status(400).json({
                message: 'User not found'
            })
        }
        user.password = newPassword;

        await user.save();

        res.status(200).json({
            message: 'password reset successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModels.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            })
        }
        const otp = Math.round(Math.random() * 1e4)
            .toString()
            .padStart(4, '0');
        user.otp = otp;
        user.otpExpired = Date.now() + 1000 + 60

        await user.save()

        const options = {
            email: user.email,
            subject: 'Reset Password',
            html: resetPasswordTemplate(otp, user.firstName)
        }
        await emailSender(options)

        res.status(200).json({
            message: 'OTP sent successfully'
        })

    } catch (error) {
        res.status(500).json({
            messsage: error.message
        })
    }
}