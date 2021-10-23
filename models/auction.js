
const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        tags: { 
            type: [String],
            required: true
        },
        event_date_time: {
            type: Date,
            default: Date.now
        },
        pickup_point: {
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
            addressState:{
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
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        completed: {
            type: Boolean,
            default: false
        },
        organizer_contact: {
            type: Number,
            required: true
        },
        items: [{
            name: {
            type: String,
            required: true,
            trim: true
            },
            quantity: {
                type: String,
                required: true,
                default: 1,
                validate(value){
                    if(value < 0)
                        throw new Error("Quantity Can't be negative")
                }
            },
            base_price: {
                type: Number,
                required: true,
                validate(value){
                    if(value < 0)
                        throw new Error("Price Can't be negative")
                }
            },
            description: {
                type: String,
                required: true
            },
            images: [{
                type: String,
                required: true
            }],
            video: {
                type: String
            },
            bid:{
                bidder:{
                    userId:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                    },
                    anonymous_name:{
                        type: String,
                    }
                },
                price:{
                    type: Number,
                },
                bid_date_time:{
                    type: Date,
                    default: Date.now
                }
            }
        }],
        chats:[{
            message_type:{
                type: String,
            },
            message:{
                type:String,
            },
            time:{
                type:Date,
                default: Date.now
            },
        }],
    }, {timestamps: true}
);

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction;