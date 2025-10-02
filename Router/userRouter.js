const {verify} = require('jsonwebtoken')
const {signUp, login, resetPassword, forgotPassword, verifyUser, resendVerification, } = require('../Controller/userController')
const { signUpValidator, loginValidator } = require('../middlewares/validator')
const router = require('express').Router()

router.post('/user',signUpValidator, signUp);
router.post('/verify', verifyUser);
router.post('/resend-otp', resendVerification);
router.post('/user/login',loginValidator, login)
router.post('/user/reset/password/:token', resetPassword)
router.post('/user/forgot/password', forgotPassword)

module.exports=router