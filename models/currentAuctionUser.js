const mongoose = require('mongoose')

const currentAuctionSchema = new mongoose.Schema({
    auction_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },

    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    userIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
})

const currentAuctionModel = mongoose.model('currentAuctionModel', currentAuctionSchema)
module.exports = currentAuctionModel