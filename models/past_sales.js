const mongoose = require("mongoose");

const pastSalesSchema = new mongoose.Schema({
    winner_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    auction_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    },
    item_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    },
    transaction_id:{
        type:String,
        required:true,
    },
}, {timeStamp: true});

const PastSales = mongoose.model("PastSales", pastSalesSchema);
module.exports = PastSales;