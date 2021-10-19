const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    addressLine1:{
        type:String,
        trim: true,
    },
    addressLine2:{
        type:String,
        trim: true
    },
    city:{
        type:Object,
        trim: true,
    },
    state:{
        type:String,
        trim: true,
    },
    postalCode:{
        type:String,
        trim: true,
    },
    country:{
        type:String,
        trim: true,
    }
})

const orderSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    total_price: {
        type: Number,
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
        address: addressSchema
    },
    buyer_details: {
        profile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        contact_number: {
            type: Number,
        },
        address: addressSchema
    },
    shipped: {
        type: Boolean,
        required: true,
        default: false
    }},
    {timestamps: true}
)

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;