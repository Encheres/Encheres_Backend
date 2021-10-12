const mongoose = require("mongoose");

const independentItemCurrentBiddingSchema = new mongoose.Schema({

    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    bidder: {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        anonymous_name: {
            type: String,
            required: true
        },
    },
    current_price: {
        type: Number,
        required: true
    }
    
}, { timeStamp: true });


const IndependentItemCurrentBidding = mongoose.model("IndependentItemCurrentBidding", independentItemCurrentBiddingSchema);
module.exports = IndependentItemCurrentBidding;