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

router.get('/:product_id/update', async function(req,res){
    const product = await dataLayer.getProductById(req.params.product_id);

    const brands = await dataLayer.getAllBrands();
    const categories = await dataLayer.getAllCategories();
    const genders = await dataLayer.getAllGenders();
    const activities = await dataLayer.getAllActivities();
    const blends = await dataLayer.getAllBlends();
    const microns = await dataLayer.getAllMicrons();
    const fits = await dataLayer.getAllFits();

    const productForm = createProductForm(brands, categories, genders, activities, blends, microns, fits);

    //fill in existing values into the form
    productForm.fields.product.value = product.get('product');
    productForm.fields.description.value = product.get('description');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.created_date.value = product.get('created_date');
    productForm.fields.product_image_url.value = product.get('product_image_url');
    productForm.fields.product_thumbnail_url.value = product.get('product_thumbnail_url');
    productForm.fields.brand_id.value = product.get('brand_id');
    productForm.fields.category_id.value = product.get('category_id');
    productForm.fields.gender_id.value = product.get('gender_id');
    productForm.fields.activity_id.value = product.get('activity_id');
    productForm.fields.blend_id.value = product.get('blend_id');
    productForm.fields.micron_id.value = product.get('micron_id');
    productForm.fields.fit_id.value = product.get('fit_id');

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})


module.exports = router;