const express = require('express');
const router = express.Router();
const ordersDataLayer = require('../../dal/orders')

router.get('/', async function(req,res){
    const orders = await ordersDataLayer.getOrdersByCustomerId(req.customer.id)
    res.send(orders)
})

module.exports = router;