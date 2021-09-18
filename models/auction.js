
const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        tags: {
            type: [String],
            required: true
        },
        event_date_time: {
            type: Date,
            required: true,
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
        },
        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        completed: {
            type: Boolean,
            required: true,
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
        aggregate_base_price: {
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
        }}]
    }, {timestamps: true}
);

const Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction;