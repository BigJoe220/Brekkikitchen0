const Joi  = require('joi');
const { Schema } = require('../Models/userModels');

exports.signUpValidator = async (req,res,next)=>{
    const Schema = Joi.object({
        firstName: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$'))
        .required().messages({
            'any.required': 'Firstname is required',
            'string.empty': 'Firstname cannot be empty',   
            'string.min': 'Firstname should contain at least 3 characters',
            'string.max': 'Firstname should not be more than 30 characters long',
            'string.pattern.base': 'Firstname can only contain letters with no spaces'
        }),

        lastName: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$'))
        .required().messages({
            'any.required': 'Lastname is required',
            'string.empty': 'Lastname cannot be empty',   
            'string.min': 'Lastname should contain at least 3 characters',
            'string.max': 'Lastname should not be more than 30 characters long',
            'string.pattern.base': 'Lastname can only contain letters with no spaces'
        }),

        email: Joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }),

        password: Joi.string()
        .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'))
        .required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',   
            'string.pattern.base': 'Password must contain at least one Uppercase, Lowercase, Digit and a special character [#?!@$%^&*-]'
        }),

        phoneNumber: Joi.string().pattern(new RegExp('^[0-9]{10,15}$')) // accepts 10–15 digits
        .required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must contain only digits and be 10 to 15 digits long'
        })
    });

    try {
        await Schema.validateAsync(req.body, { abortEarly: false });
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.details.map(d => d.message) });
    }
};
exports.loginValidator = async (req,res,next)=>{
    const Schema = Joi.object({
         firstName: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$'))
        .required().messages({
            'any.required': 'Firstname is required',
            'string.empty': 'Firstname cannot be empty',   
            'string.min': 'Firstname should contain at least 3 characters'
        }),

        lastName: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$'))
        .required().messages({
            'any.required': 'Lastname is required',
            'string.empty': 'Lastname cannot be empty',   
            'string.min': 'Lastname should contain at least 3 characters'
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Invalid email format'
        }), 
        password: Joi.string().required().messages({
            'any.required': 'password is required',
            'string.empty': 'password cannot be empty',
        }),
                phoneNumber: Joi.string().pattern(new RegExp('^[0-9]{10,15}$')) // accepts 10–15 digits
        .required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must contain only digits and be 10 to 15 digits long'
        })

    })
    const {error} = Schema.validate(req.body)
    if(error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }
    next()
}