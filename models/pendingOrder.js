const mongoose = require('mongoose')

const pendingOrderSchema = new mongoose.Schema({
    AuctionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    },
    WinningPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: trueI
    },
    SellerDetails: {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        sellerContact: {},
        selleraddress: {}
    },
    WinnerDetails: {
        winnerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        winnerContact: {},
        winneraddress: {}
    },
    TransactionId: {},
    trackingShipment: {}
})
const pendingOrderModel = mongoose.model("pendingOrderModel", pendingOrderSchema)
module.exports = pendingOrderModel