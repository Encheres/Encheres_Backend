const mongoose = require('mongoose')

const currentAuctionSchema = new mongoose.Schema({
    auction_id = {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    },
    itemIds = [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auction',
        required: true
    }],
    userIds = [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }]
})

const currentAuctionModel = mongoose.Model('currentAuctionModel', currentAuctionSchema)
module.exports = currentAuctionModel