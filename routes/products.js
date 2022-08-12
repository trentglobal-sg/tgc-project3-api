const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/products');
const { createProductForm, bootstrapField } = require('../forms');
const { Product } = require("../models");

router.get('/', async function (req, res) {
    let products = await dataLayer.getAllProducts();
    res.render("products/index", {
        'products': products.toJSON(),
    });
})

router.get('/create', async function (req, res) {
    const brands = await dataLayer.getAllBrands();
    const categories = await dataLayer.getAllCategories();
    const genders = await dataLayer.getAllGenders();
    const activities = await dataLayer.getAllActivities();
    const blends = await dataLayer.getAllBlends();
    const microns = await dataLayer.getAllMicrons();
    const fits = await dataLayer.getAllFits();

    const productForm = createProductForm(brands, categories, genders, activities, blends, microns, fits);

    res.render('products/create', {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', async function (req, res) {
    const brands = await dataLayer.getAllBrands();
    const categories = await dataLayer.getAllCategories();
    const genders = await dataLayer.getAllGenders();
    const activities = await dataLayer.getAllActivities();
    const blends = await dataLayer.getAllBlends();
    const microns = await dataLayer.getAllMicrons();
    const fits = await dataLayer.getAllFits();

    const productForm = createProductForm(brands, categories, genders, activities, blends, microns, fits);
    productForm.handle(req, {
        'success': async (form) => {
            let created_date = new Date();
            const productData = {...form.data, created_date}
            const product = new Product(productData)
            await product.save();
            
            res.redirect('/products')
        },
        // 'error': (form) => {
        //     res.render('products/create', {
        //         form: productForm.toHTML(bootstrapField),
        //         cloudinaryName: process.env.CLOUDINARY_NAME,
        //         cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        //         cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
        //     })
        // },
    })
})

router.get('/:product_id', async function (req, res) {
    const product = await dataLayer.getProductById(req.params.product_id);
    res.render('products/product', {
        'product': product.toJSON(),
    })
})



module.exports = router;