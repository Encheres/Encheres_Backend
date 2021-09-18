const express = require('express');
const Order = require('../models/order');
var router = express.Router();

// Creating new order.
router.route('/orders')
.post(async (req, res, next) => {
    try {

        var order = new Order(req.body);
        await order.save();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json')
        res.json(order);
    } catch (error) {
        next(error);
    }
})

// CRUD on particular order.
router.route('/orders/:orderId')
.get(async (req, res, next) => {
    try {
        var orders = await Order.find({'_id': req.params.orderId});
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);

    } catch (error) {
        next(error);
    }
})
.put(async (req, res, next) => {

    try {
        var order = await Order.findByIdAndUpdate(req.params.orderId, 
            {$set: req.body}, 
            {new: true});
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);

    } catch (error) {
        next(error);
    }
})
.delete(async (req, res, next) => {

    try {
		var operation = await Order.deleteOne({"_id": req.params.orderId});
		res.status(200).json(operation);
	} catch (error) {
		next(error);
	}

})

// pending orders (Buyer side).
router.route('/buyer-pending-orders/:buyerId')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var orders = await Order.find({
            'buyer_details.profile': req.params.buyerId,
            'shipped': false
        })
        .sort({'createdAt':-1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
})

// pending orders (Seller side).
router.route('/seller-pending-orders/:sellerId')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var orders = await Order.find({
            'seller_details.profile': req.params.sellerId,
            'shipped': false
        })
        .sort({'createdAt':-1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
})

// shipped orders (Buyer side).
router.route('/buyer-shipped-orders/:buyerId')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var orders = await Order.find({
            'buyer_details.profile': req.params.buyerId,
            'shipped': true
        })
        .sort({'createdAt':-1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
})

// shipped orders (Seller side).
router.route('/seller-shipped-orders/:sellerId')
.get(async (req, res, next) => {

    const PAGE_SIZE = 5;
    const page = parseInt(req.query.page || "0");

    try{
        var orders = await Order.find({
            'seller_details.profile': req.params.sellerId,
            'shipped': true
        })
        .sort({'createdAt':-1}).limit(PAGE_SIZE).skip(PAGE_SIZE*page);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;