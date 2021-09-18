const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    item_price: {
        type: Number,
        required: true,
        validate(value){
            if(value < 0)
                throw new Error("Price Can't be negative")
        }
    },
    seller_details: {
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        contact_number: {
            type: Number,
            required: true
        },
        address: {
            addressLine1:{
                type:String,
                trim: true,
                required: true,
            },
            addressLine2:{
                type:String,
                trim: true
            },
            city:{
                type:Object,
                trim: true,
                required: true,
            },
            state:{
                type:String,
                trim: true,
                required: true,
            },
            postalCode:{
                type:String,
                trim: true,
                required: true
            },
            country:{
                type:String,
                trim: true,
                required:true
            }
        }
    },
    buyer_details: {
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        contact_number: {
            type: Number,
            required: true
        },
        address: {
            addressLine1:{
                type:String,
                trim: true,
                required: true,
            },
            addressLine2:{
                type:String,
                trim: true
            },
            city:{
                type:Object,
                trim: true,
                required: true,
            },
            state:{
                type:String,
                trim: true,
                required: true,
            },
            postalCode:{
                type:String,
                trim: true,
                required: true
            },
            country:{
                type:String,
                trim: true,
                required:true
            }
        }
    },
    payment_id: {
        type: String,
        trim: true
    },
    shipped: {
        type: Boolean,
        required: true,
        default: false
    },
    tracking_details: {
        type: String,
        trim: true
    }
})

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;