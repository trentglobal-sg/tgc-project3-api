const express = require('express');
const router = express.Router();
const cartServices = require('../../services/cart')

router.get('/', async function (req,res){
    console.log(req.customer.id)
    const response = await cartServices.getCart(req.customer.id);
    cartItems = response.toJSON()
    res.json(cartItems)
})

router.post('/:product_variant_id/add', async function(req,res){
    const customerId = req.customer.id
    const productVariantId = req.params.product_variant_id;
    const quantity = req.body.quantity
    console.log('quantity at api: ', quantity)

    let addToCart = await cartServices.addToCart(customerId, productVariantId, quantity);
    if (addToCart){
        res.json({
            'success': 'item added'
        })
    } else {
        res.status(400)
        res.json({
            'error': "item not added"
        })
    }
    
})

router.post('/:product_variant_id/update', async function(req,res){
    const customerId = req.customer.id
    const productVariantId = req.params.product_variant_id;
    const quantity = req.body.quantity
    
    let updateCartItem = await cartServices.updateQuantity(customerId, productVariantId, quantity);
    if (updateCartItem){
        res.json({
            'success': 'quantity updated'
        })
    } else {
        res.json({
            'error': 'item not updated'
        })
    }
})

router.delete('/:product_variant_id/delete', async function(req,res){
    const customerId = req.customer.id
    const productVariantId = req.params.product_variant_id
    await cartServices.removeCartItem(customerId, productVariantId)
    res.json({
        'success': 'cart item deleted'
    })
})

module.exports = router;