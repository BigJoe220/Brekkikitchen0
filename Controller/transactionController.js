const transactionModel = require('../Models/transactionModel');
const axios = require("axios");
const userModel = require("../Models/userModels");
const cartModels = require('../Models/cartModels');

exports.initiateTransaction = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);
        const cart = await cartModels.find({userId: user._id });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        };

        const totalPrice = cart.reduce((a,b)=> a + b.Subtotal, 0);
        const ref = `BrekkieKitchen_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const data = {
            amount: totalPrice, // Convert to smallest currency unit
            currency: "NGN",
            customer: {
                email: user.email,
                name: user.firstName
            },
            reference: ref
        };
        const response = await axios.post("https://api.korapay.com/merchant/api/v1/charges/initialize", data, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_SECRETE}`,
            }
        });

        const transaction = new transactionModel({
            userId: user._id,
            cartId: cart._id,
            reference: ref,
        });
        await transaction.save();
        res.status(200).json({
            message: "Transaction initiated",
            data: {
                reference: response?.data?.data?.reference,
                url: response?.data?.data?.checkout_url
            }
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

exports.verifyTransaction = async (req, res) => {
    try {
        const { reference } = req.query;

        const response = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.KORA_SECRETE}`,
                "Content-Type": "application/json"
            }
        });

        const transaction = await transactionModel.findOne({ reference });
        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        if (response?.data?.data?.status === "success") {
            transaction.status = "successful";
            await transaction.save();
            return res.status(200).json({
                message: "Transaction successful"
            });
        } else {
            transaction.status = "Failed";
            await transaction.save();
            return res.status(400).json({
                message: "Transaction failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


exports.all= async(req, res)=>{
    try{
        const{id}= req.params
        const transaction = await transactionModel.find()
        return res.statu(200).json({
            message:"All transaction retrieved"
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}