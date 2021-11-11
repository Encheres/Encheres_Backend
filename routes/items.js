var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Item = require("../models/item");
const Pusher = require("pusher");

const auth = require('../middleware/auth');

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_KEY}`,
    secret: `${process.env.PUSHER_SECRET}`,
    cluster: "ap2",
    useTLS: true
});

const db = mongoose.connection;

db.once("open", () => {
    try{
        const itemCollection = db.collection("items");
        const changeStream = itemCollection.watch();
        changeStream.on("change", (change) => {
            if (change.operationType === "update") {
                const bidDetails = change.fullDocument;
                pusher.trigger("biddings", "updated", { msg: "New Bid added!" });
            } else {
                console.log("Pusher error");
            }
        });
    }catch(err){
        console.log(err);
    }
});

// For tag-filtered query.
router.route('/filtered-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({event_start_date_time : { $lte: new Date() },
        event_end_date_time : { $gte: new Date() }, sale: true, "categories" : { $in: req.query.tags.split(',')}})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page).populate('owner').populate('bidder');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})

// For Usual auction listing.
router.route('/items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({ event_start_date_time : { $lte: new Date() }, 
        event_end_date_time : { $gte: new Date() },sale: true})
        .sort({'event_end_date_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page).populate('owner').populate('bidder');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})
.post(async (req, res, next) => {

    try {
        var item = new Item(req.body);
        await item.save();
        res.status(200).json(item);
    } catch (error) {
        next(error);
    }
})

// For particular auction CRUD.
router.route('/items/:itemId')
.get(async (req, res, next) => {
    try {
        var item = await Item.findById(req.params.itemId).populate('owner').populate('bidder');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);

    } catch (error) {
        next(error);
    }
})
.put(auth, async (req, res, next) => {

    try {
        var oldItem = await Item.findById(req.params.itemId);

        /******** BACKEND AVOIDANCE TO ALLOW ONLY HIGHER BIDS *******/
        if(oldItem.bids==true && req.body.asset.aggregate_base_price <= oldItem.asset.aggregate_base_price){
            err = new Error();
            err.status = 400;
            return next(err);  
        }
        else{
            var item = await Item.findByIdAndUpdate(req.params.itemId, 
                {$set: req.body}, 
                {new: true});
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(item);
        }

    } catch (error) {
        next(error);
    }
})
.delete(auth, async (req, res, next) => {

    try {
		var operation = await Item.deleteOne({"_id": req.params.itemId});
		res.status(200).json(operation);
	} catch (error) {
		next(error);
	}

})
.patch(auth, async(req,res)=>{
	try{
        var item = await Item.findByIdAndUpdate(req.params.itemId, 
            {$set: req.body}, 
            {new: true});
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
	}catch(error){
		next(error)
	}
});

// Completed Auctions.

router.route('/sold-items')
.get(auth, async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({event_end_date_time : { $lte: new Date() }, bidder: req.user._id})
        .sort({'event_end_date_time':-1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page).populate('owner').populate('bidder');

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})


/************* FIXED PRICE ITEMS ROUTES ****************/

// For tag-filtered query.
router.route('/filtered-fixed-price-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({"categories" : { $in: req.query.tags.split(',')}, sale: true, bids: false})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})

// For Usual auction listing.
router.route('/fixed-price-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({sale: true, bids: false})
        .sort({'event_end_date_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})

// Completed Auctions.
router.route('/sold-filtered-fixed-price-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({"tags" : { $in: req.query.tags.split(',')}, sale: false, bids: false})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})

router.route('/sold-fixed-price-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({sale: false, bids: false})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})


module.exports = router;