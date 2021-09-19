const mongoose = require("mongoose");

const currentBiddingSchema = new mongoose.Schema({
    // The current bidding
    auction_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    item_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    bidder:{
        user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        },
        anonymous_name:{
            type: String,
            required: true
        },
    },
    current_price:{
        type: Number,
        required: true
    }
}, {timeStamp: true});


const CurrentBidding = mongoose.model("CurrentBidding", currentBiddingSchema);
module.exports = CurrentBidding;