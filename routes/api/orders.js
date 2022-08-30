const express = require('express');
const router = express.Router();
const ordersDataLayer = require('../../dal/orders')

router.get('/', async function(req,res){
    let customerId = req.customer.id
    console.log('customer:',customerId)
    const orders = await ordersDataLayer.getOrdersByCustomerId(customerId)
    res.send(orders)
})

module.exports = router;