var express = require('express');
var router = express.Router();
const Item = require("../models/item");

const auth = require('../middleware/auth');

// For tag-filtered query.
router.route('/filtered-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({"categories" : { $in: req.query.tags.split(',')}, sale: true, bids: true})
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
router.route('/items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({sale: true, bids: true})
        .sort({'event_end_date_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})
.post(auth, async (req, res, next) => {
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
        var item = await Item.findById(req.params.itemId);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);

    } catch (error) {
        next(error);
    }
})
.put(auth, async (req, res, next) => {

    try {
        var item = await Item.findByIdAndUpdate(req.params.itemId, 
            {$set: req.body}, 
            {new: true});
        
        console.log('Sucess!!');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);

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

// Completed Auctions.
router.route('/sold-filtered-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({"tags" : { $in: req.query.tags.split(',')}, sale: false, bids: true})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(items);
    }
    catch (error) {
        next(error);
    }
})

router.route('/sold-items')
.get(async (req, res, next) => {

    const PAGE_SIZE = 4;
    const page = parseInt(req.query.page || "0");

    try{
        var items = await Item.find({sale: false, bids: true})
        .sort({'event_start_end_time':1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

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