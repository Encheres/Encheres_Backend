const express = require('express')
const router = express.Router()
const contactModel = require('../models/Contact')


router.post('/', async(req, res, next) => {
    try {
        const tempcontact = contactModel(req.body);
        await tempcontact.save()
        res.status(201).type('application json')
        res.json({ message: "Successfully recorded your response", data: tempcontact });
    } catch (err) {
        res.send("sorrt error")
    }
})
module.exports = router