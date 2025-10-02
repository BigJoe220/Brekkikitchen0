const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required: true
    },
    lastName:{
      type:String,
      required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default: false
    },
    isLoggedIn:{
        type:Boolean,
        default: false
    },
    otp: {
        type: String
    },
    otpExpired :{
        type: Number
    }
},{timestamps:true})
const userModels = mongoose.model('user', userSchema)

module.exports=userModels
