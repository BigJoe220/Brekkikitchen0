const { required } = require('joi');
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    reference: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Successful', 'Failed'],
        default: 'Pending'
    },
}, { timestamps: true });
const transactionModel = mongoose.model('transaction', transactionSchema)

module.exports = transactionModel;