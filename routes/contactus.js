const express = require('express')
const router = express.Router()
const contactModel = require('../models/contact')


router.post('/', async(req, res, next) => {
    try {
        const tempcontact = contactModel(req.body);
        await tempcontact.save()
        res.status(201).send({ message: "Successfully recorded your response", data: tempcontact });
    } catch (err) {
        res.status(400).send({error:err})
    }
})
module.exports = router