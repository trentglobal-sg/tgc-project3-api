const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/products');
const { createProductForm, bootstrapField, createVariantForm } = require('../forms');
const { Product, Variant } = require("../models");

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
            const productData = { ...form.data, created_date }
            const product = new Product(productData)
            const saved = await product.save()
            // await product.save();
            console.log(saved.toJSON())

            res.redirect('/products')
        },
        'error': (form) => {
            res.render('products/create', {
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
    })
})

router.get('/:product_id', async function (req, res) {
    const product = await dataLayer.getProductById(req.params.product_id);
    const variants = await dataLayer.getProductVariants(req.params.product_id);

    // variants = variantsData.toJSON();
    console.log(variants.toJSON())

    res.render('products/product', {
        'product': product.toJSON(),
        'variants': variants.toJSON(),
    })
})

router.get('/:product_id/update', async function (req, res) {
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
    // productForm.fields.created_date.value = product.get('created_date');
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

router.post('/:product_id/update', async function (req, res) {
    const product = await dataLayer.getProductById(req.params.product_id);

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
            console.log(product.get('created_date'))
            updateForm = { ...form.data, created_date: product.get('created_date') }
            console.log(updateForm)
            product.set(updateForm);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            // console.log(form.data)
            // res.send('error')
            res.send("error");
        }
    })
})

router.get('/:product_id/create-variant', async function (req, res) {
    const sizes = await dataLayer.getAllSizes();

    const variantForm = createVariantForm(sizes)

    res.render('products/create-variant', {
        form: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/create-variant', async function (req, res) {
    const sizes = await dataLayer.getAllSizes();

    const variantForm = createVariantForm(sizes);
    variantForm.handle(req, {
        'success': async (form) => {
            const product_id = req.params.product_id
            const variantData = { ...form.data, product_id }
            const variant = new Variant(variantData)
            const saved = await variant.save()

            console.log(saved.toJSON())

            res.redirect('/products')
        },
        'error': async (form) => {
            res.render('products/create-variant', {
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

module.exports = router;