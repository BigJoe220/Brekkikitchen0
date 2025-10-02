const mongoose = require ('mongoose')

const productSchema = new mongoose.Schema({
    name:{
    type:String,
    required:true
 },
 price:{
    type:String,
    required:true
 },
description:{
    type:String,
    required:true
},
categories:{
    type:String,
    required:true
},
Images:[{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true
        }
    }]
}, {timestamps:true})
const productModels = mongoose.model('product', productSchema)

module.exports=productModels
