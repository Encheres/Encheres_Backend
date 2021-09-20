const express = require("express");
const CurrentBidding = require('../models/current_bidding');
var router = express.Router();
const mongoose = require("mongoose");
const Pusher = require("pusher");


const pusher = new Pusher({
  appId: `${process.env.PUSHER_APP_ID}`,
  key: `${process.env.PUSHER_KEY}`,
  secret: `${process.env.PUSHER_SECRET}`,
  cluster: "ap2",
  useTLS: true
});

const db = mongoose.connection;

db.once("open", () => {
  const bidCollection = db.collection("currentbiddings");
  const changeStream = bidCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const bidDetails = change.fullDocument;
      pusher.trigger("biddings", "inserted", { msg: "New Bid added!" });
    } else {
      console.log("Pusher error");
    }
  });
});

// Posting a Bid
router.post("/current_biddings", async (req, res) => {
  try {

    var bid = new CurrentBidding(req.body);
    bid.save();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(bid);

  } catch(error) {
    next(error);
  }
});

// Getting all Bids.
router.get("/current_biddings/:auctionId/:itemId", async (req, res) => {
    
  try {
    var biddings = await CurrentBidding
    .find({$and: 
        [
            {'auction_id': req.params.auctionId}, 
            {'item_id': req.params.itemId}
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
router.delete("/current_biddings/:auctionId", async (req, res) => {

  try{
    var operation = await CurrentBidding.deleteMany({"auction_id": req.params.auctionId});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(operation);

  }
  catch(error){
    next(error);
  }

})

module.exports = router;
