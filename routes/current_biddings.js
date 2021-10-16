const express = require("express");
const CurrentBidding = require('../models/current_bidding');
var router = express.Router();
const mongoose = require("mongoose");
const Pusher = require("pusher");

const auth = require('../middleware/auth');

// Posting a Bid
router.post("/current_biddings", auth, async(req, res) => {
    try {

        var bid = new CurrentBidding(req.body);
        await bid.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bid);

    } catch (error) {
        next(error);
    }
});

// Getting all Bids.
router.get("/current_biddings/:auctionId/:itemId", auth, async(req, res) => {

    try {
        var biddings = await CurrentBidding
            .find({
                $and: [
                    { 'auction_id': req.params.auctionId },
                    { 'item_id': req.params.itemId }
                ]
            })
            .sort({ createdAt: "asc" })

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(biddings);

    } catch (error) {
        next(error);
    }
});

// Delete Bids After Auction ends.
router.delete("/current_biddings/:auctionId", auth, async(req, res) => {

    try {
        var operation = await CurrentBidding.deleteMany({ "auction_id": req.params.auctionId });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(operation);
    } catch (error) {
        next(error);
    }

})

module.exports = router;