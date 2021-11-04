var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')
const Pusher = require('pusher')
const Auction = require('../models/auction');
const Order = require('../models/order');
const auth = require('../middleware/auth');

const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    useTLS: true
});

const db  = mongoose.connection;
db.once('open', () => {
    const auctionCollection = db.collection('Auction');
    const changeStream = auctionCollection.watch();
      
    changeStream.on('change', (change) => {
        if (change.operationType === "update") {
            const bidDetails = change.fullDocument;
            // pusher.trigger("auctions", "updated", { msg: "New Bid added!" });
        }else{
            console.log("Pusher Error");
        }
    
    });
  });


// For tag-filtered query.
router.route('/filtered-auctions')
    .get(async(req, res, next) => {

        const PAGE_SIZE = 5;
        const page = parseInt(req.query.page || "0");

        try {
            var auctions = await Auction.find({ "tags": { $in: req.query.tags.split(',') }, completed: false })
                .sort({ 'event_date_time': 1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auctions);
        } catch (error) {
            next(error);
        }
    })

// For Usual auction listing.
router.route('/auctions')
    .get(async(req, res, next) => {

        const PAGE_SIZE = 5;
        const page = parseInt(req.query.page || "0");

        try {
            var auctions = await Auction.find({ completed: false })
                .sort({ 'event_date_time': 1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auctions);
        } catch (error) {
            next(error);
        }
    })
    .post(auth, async(req, res, next) => {
        try {
            var auction = new Auction(req.body);
            await auction.save();
            res.status(200).json({message:"Auction created Successfully"});
        } catch (error) {
            next(error);
        }
    })

// For particular auction CRUD.
router.route('/auctions/:auctionId')
    .get(async(req, res, next) => {
        try {
            var auction = await Auction.findById(req.params.auctionId).populate('organizer', 'name');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auction);

        } catch (error) {
            console.log(error);
            next(error);
        }
    })
    .put(auth, async(req, res, next) => {

        try {
            var auction = await Auction.findByIdAndUpdate(req.params.auctionId, { $set: req.body }, { new: true });

            console.log('Sucess!!');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auction);

        } catch (error) {
            next(error);
        }
    })
    .delete(auth, async(req, res, next) => {

        try {
            var operation = await Auction.deleteOne({ "_id": req.params.auctionId });
            res.status(200).json(operation);
        } catch (error) {
            next(error);
        }

    })

// For getting a particular item.
router.route('/auctions/:auctionId/:itemId')
    .get(async(req, res, next) => {
        try {
            var auction = await Auction.findById(req.params.auctionId);
            console.log(auction);
            var item = auction.items.id(req.params.itemId);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(item);

        } catch (error) {
            next(error);
        }
    })

// Completed Auctions.
router.route('/completed-filtered-auctions')
    .get(async(req, res, next) => {
        const PAGE_SIZE = 5;
        const page = parseInt(req.query.page || "0");

        try {
            var auctions = await Auction.find({ "tags": { $in: req.query.tags.split(',') }, completed: true })
                .sort({ 'event_date_time': 1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auctions);
        } catch (error) {
            next(error);
        }
    })

router.route('/completed-auctions')
    .get(async(req, res, next) => {

        const PAGE_SIZE = 5;
        const page = parseInt(req.query.page || "0");

        try {
            var auctions = await Auction.find({ completed: true })
                .sort({ 'event_date_time': 1 }).limit(PAGE_SIZE).skip(PAGE_SIZE * page);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(auctions);
        } catch (error) {
            next(error);
        }
    })

    // used to update bid price.
router.patch('/auctions/:auctionId/:itemId', async(req,res)=>{
    try{
        const auctionId = req.params.auctionId;
        const itemId = req.params.itemId;
        const data = req.body;
        let oldItem = await Auction.findById(auctionId);
        let index = oldItem.items.findIndex(item => item._id == itemId);
        const date_time = new Date();
        
        if(oldItem.items[index].sell.sold){
            throw new Error('Item is already sold');
        }

        if(!oldItem.items[index].bid.price || (parseFloat(oldItem.items[index].bid.price) < parseFloat(data.bid.price))){
            oldItem.items[index].bid.price = data.bid.price;
            oldItem.items[index].bid.bidder = data.bid.bidder;
            oldItem.items[index].bid.bid_date_time = date_time;
            oldItem.chats.push({message_type:'general', message:data.bid.price + " ETH: Competing Bid", time:date_time});
            await oldItem.save();
            pusher.trigger('auctions', 'updated', {
                msg: 'New Bid added!'
            });
            res.status(204).send(oldItem);
        }
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }

})

router.patch('/auctions/chats/:auctionId', async(req,res)=>{
    try{
        const auctionId = req.params.auctionId;
        const data = req.body;
        let oldItem = await Auction.findById(auctionId);
        const date_time = new Date();
        oldItem.chats.push({message_type:data.type, message:data.message, time:date_time});
        await oldItem.save();
        pusher.trigger('auctions', 'updated', {
            msg: 'New Notification added!'
        });
        res.status(204).send(oldItem);

    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
})

router.patch('/auctions/sell/:auctionId/:itemId', async(req,res)=>{
    try{
        const auctionId = req.params.auctionId;
        const itemId = req.params.itemId;
        const data = req.body;
        let oldItem = await Auction.findById(auctionId);
        let index = oldItem.items.findIndex(item => item._id == itemId);
        
        const date_time = new Date();
        const latest_bid = oldItem.items[index].bid;
        if(!latest_bid.bidder.userId){
            throw new Error('Invalid sell request');
        }
        
        if(oldItem.items[index].sell.sold === false){
            let bid_time = oldItem.items[index].bid.bid_date_time;
            let diff = (Date.parse(date_time) - Date.parse(bid_time))/1000;
            if(diff >=120){ // time for bid timeout
                oldItem.items[index].sell.sold = true;
                oldItem.items[index].sell.sold_date_time = date_time;
                oldItem.items[index].sell.sold_price = latest_bid.price;
                oldItem.items[index].sell.sold_bidder = latest_bid.bidder.userId;
                if(index==oldItem.items.length-1){
                    oldItem.completed = true;
                    oldItem.chats=[];
                }
                oldItem.chats.push({message_type:'sold', message:oldItem.items[index].name + " sold to "+ oldItem.items[index].bid.bidder.anonymous_name, time:date_time});
                await oldItem.save();
                // add item to shipping section
                let shipping = await Order.findOne({auction_id:auctionId, item_id:itemId});
                if(!shipping){
                    shipping = new Order({
                        auction_id:auctionId,
                        item_id:itemId,
                        total_price:oldItem.items[index].sell.sold_price,
                        seller_details:{
                            profile: oldItem.organizer,
                            address: oldItem.pickup_point,
                            contact: oldItem.organizer_contact

                        },
                        buyer_details:{
                            profile: oldItem.items[index].sell.sold_bidder,
                            
                        },
                        shipped:false,
                    });
                    await shipping.save();
                }
                pusher.trigger('auctions', 'updated', {
                    msg: 'Item Sold'
                });
            }
        }
        res.status(204).send(oldItem);
    }catch(error){
        res.status(500).send(error);
    }


})


router.post("/join_auction/:auctionId", auth, async(req, res, next)=>{
    const auctionId= req.params.auctionId;
    pusher.trigger()

})

module.exports = router;