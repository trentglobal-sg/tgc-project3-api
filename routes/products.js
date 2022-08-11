const express = require("express");
const router = express.Router();

const {Product, Brand} = require('../models');
const dataLayer = require('../dal/products')

router.get('/', async function(req,res){
    let products = await dataLayer.getAllProducts();
    res.render("products/index", {
        'products': products.toJSON(),
    });
})

router.get('/:product_id', async function(req,res){
    const product = await dataLayer.getProductById(req.params.product_id);
    res.render('products/product', {
        'product': product.toJSON(),
    })
})

module.exports = router;