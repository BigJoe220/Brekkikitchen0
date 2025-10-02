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
    type:Number,
    default:1
   },
   price:{
    type:String,
    required:true
   },
   Subtotal:{
    type:String,
    required:true
   },
    foodId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'foods',
       required: true
     },
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'users',
         required: true
       },
   
},{timestamps:true})
const cartModels = mongoose.model('carts', cartSchema)

module.exports=cartModels
