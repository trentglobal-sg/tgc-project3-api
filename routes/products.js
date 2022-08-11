const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/products');
const {createProductForm, bootstrapField} = require('../forms');

router.get('/', async function(req,res){
    let products = await dataLayer.getAllProducts();
    res.render("products/index", {
        'products': products.toJSON(),
    });
})

router.get('/create', async function(req,res){
    const brands = await dataLayer.getAllBrands();
    const categories = await dataLayer.getAllCategories();
    const genders = await dataLayer.getAllGenders();
    const activities = await dataLayer.getAllActivities();
    const blends = await dataLayer.getAllBlends();
    const microns = await dataLayer.getAllMicrons();
    const fits = await dataLayer.getAllFits();

    const productForm = createProductForm(brands, categories, genders, activities, blends, microns, fits);

    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
})

router.get('/:product_id', async function(req,res){
    const product = await dataLayer.getProductById(req.params.product_id);
    res.render('products/product', {
        'product': product.toJSON(),
    })
})



module.exports = router;