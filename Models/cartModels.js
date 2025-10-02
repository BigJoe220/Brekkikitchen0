const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true
    },
   description:{
    type:String,
    required:true
   },
   quantity:{
    type:String,
    required:true
   },
   price:{
    type:String,
    required:true
   },
   Subtotal:{
    type:String,
    required:true
   }
},{timestamps:true})
const cartModels = mongoose.model('order', cartSchema)

module.exports=cartModels
