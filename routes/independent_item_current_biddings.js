const express = require("express");
const IndependentItemCurrentBidding = require('../models/independent_item_current_bidding');
var router = express.Router();
const mongoose = require("mongoose");

const auth = require('../middleware/auth');

// Posting a Bid
router.post("/independent_item_current_biddings", auth, async(req, res) => {
    try {

        var bid = new IndependentItemCurrentBidding(req.body);
        await bid.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(bid);

    } catch (error) {
        next(error);
    }
});

// Getting all Bids.
router.get("/independent_item_current_biddings/:itemId", auth, async(req, res) => {

    try {
        var biddings = await CurrentBidding
            .find({
                'item_id': req.params.itemId
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
router.delete("/independent_item_current_biddings/:itemId", auth, async(req, res) => {

    try {
        var operation = await IndependentItemCurrentBidding.deleteMany({ "item_id": req.params.itemId });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(operation);
    } catch (error) {
        next(error);
    }

})

module.exports = router;