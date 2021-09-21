const express = require('express')
const mongoose = require('mongoose')
const model = require('../models/currentAuctionUser')
const router = express.Router()
const Pusher = require("pusher");

const auth = require('../middleware/auth');

const pusher = new Pusher({
    appId: `${process.env.PUSHER_APP_ID}`,
    key: `${process.env.PUSHER_KEY}`,
    secret: `${process.env.PUSHER_SECRET}`,
    cluster: "ap2",
    useTLS: true
});
/*
    Connection to db and then using pusher there..
*/
const db = mongoose.connection

router.route('enter').post(auth, async(res, req, next) => {
    try {
        var entry = model(req.body)
        await entry.save()
        Pusher.trigger('currentUsers', 'enter', { message: "new user entered" })
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json("successfully entered");
    } catch (err) {
        console.log(err)
    }
})
router.route('/exit/:userid/:auction_id/:itemId').delete(auth, (res, req, next) => {
    try {
        var first = { "auction_id": req.params.auction_id, "itemId": req.params.itemId };
        var operation = model.updateOne(first, { $pull: { userIds: req.params.userid } })
        Pusher.trigger('currentUsers', 'exit', { message: `${req.params.userid} exited` })
        res.status(200).json(operation);


    } catch (err) {
        console.log(err)
    }
})

module.exports = router