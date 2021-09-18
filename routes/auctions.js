var express = require('express');
var router = express.Router();
const Auction = require('../models/auction');

// For tag-filtered query.
router.route('/filtered-auctions')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var auctions = await Auction.find({"tags" : { $in: req.query.tags.split(',')}})
        .sort({'event_date_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(auctions);
    }
    catch (error) {
        next(error);
    }
})

// For Usual auction listing.
router.route('/auctions')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var auctions = await Auction.find({})
        .sort({'event_date_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(auctions);
    }
    catch (error) {
        next(error);
    }
})
.post(async (req, res, next) => {
    try {
        var auction = new Auction(req.body);
        await auction.save();
        res.status(200).json(auction);
    } catch (error) {
        next(error);
    }
})

// For particular auction CRUD.
router.route('/auctions/:auctionId')
.get(async (req, res, next) => {
    try {
        var auction = await Auction.findById(req.params.auctionId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(auction);

    } catch (error) {
        next(error);
    }
})
.put(async (req, res, next) => {

    try {
        var auction = await Auction.findByIdAndUpdate(req.params.auctionId, 
            {$set: req.body}, 
            {new: true});
        
        console.log('Sucess!!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(auction);

    } catch (error) {
        next(error);
    }
})
.delete(async (req, res, next) => {

    try {
		var operation = await Auction.deleteOne({"_id": req.params.auctionId});
		res.status(200).json(operation);
	} catch (error) {
		next(error);
	}

})

// For getting a particular item.
router.route('/auctions/:auctionId/:itemId')
.get(async (req, res, next) => {
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

module.exports = router;