const express = require('express')
const router = express.Router()
const contactModel = require('../models/contact')
const {sendContactUsEmail} = require('../middleware/emails');

router.post('/', async(req, res, next) => {
    try {
        const data = contactModel(req.body);
        await sendContactUsEmail(data);
        res.status(201).send({ message: "Successfully recorded your response"});
    } catch (err) {
        res.status(400).send({error:"Something went wrong"});
    }
})
module.exports = router