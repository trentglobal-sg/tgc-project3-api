const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/products');
const { createProductForm, bootstrapField, createVariantForm, createProductVariantForm } = require('../forms');
const { Product, Variant, Product_variant } = require("../models");

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
            console.log(saved.toJSON()) //TODO redirect to add new variant immediately?

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
            res.render('products/update', {
                form: form.toHTML(bootstrapField),
                product: product.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/:product_id/create-variant', async function (req, res) {
    const variantForm = createVariantForm()

    res.render('products/create-variant', {
        form: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/create-variant', async function (req, res) {
    const variantForm = createVariantForm();
    variantForm.handle(req, {
        'success': async (form) => {
            const product_id = req.params.product_id
            const variantData = { ...form.data, product_id }
            const variant = new Variant(variantData)
            const saved = await variant.save()

            res.redirect('/products/' + req.params.product_id)
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

router.get('/:product_id/update-variant/:variant_id', async function (req,res){
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    console.log(variant.toJSON())
    const variantForm = createVariantForm(); 

    //fill in the form fields
    variantForm.fields.color_code.value = variant.get('color_code');
    variantForm.fields.color_name.value = variant.get('color_name');
    variantForm.fields.variant_image_url.value = variant.get('variant_image_url');
    variantForm.fields.variant_thumbnail_url.value = variant.get('variant_thumbnail_url');

    res.render('products/update-variant', {
        form: variantForm.toHTML(bootstrapField),
        variant: variant.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update-variant/:variant_id', async function(req,res){
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const variantForm = createVariantForm();

    variantForm.handle(req, {
        'success': async (form) => {
            variant.set(form.data);
            variant.save();
            res.redirect('/products/' + req.params.product_id);
        },
        'error': async (form) => {
            res.render('products/update-variant', {
                form: form.toHTML(bootstrapField),
                variant: variant.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/:product_id/update-variant/:variant_id/add-product-variant', async function (req,res){
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const sizes = await dataLayer.getAllSizes();
    const productVariantForm = createProductVariantForm(sizes);

    res.render('products/create-product-variant',{
        form: productVariantForm.toHTML(bootstrapField),
        variant: variant.toJSON()
    })
})

router.post('/:product_id/update-variant/:variant_id/add-product-variant', async function (req,res){
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const sizes = await dataLayer.getAllSizes();
    const productVariantForm = createProductVariantForm(sizes);

    productVariantForm.handle(req, {
        'success': async(form) => {
            const variant_id = req.params.variant_id
            const product_variant_data = {...form.data, variant_id}
            const product_variant = new Product_variant(product_variant_data)
            const saved = await product_variant.save()

            res.redirect('/products/' + req.params.product_id)
        },
        'error': async (form) => {
            res.render('products/create-product-variant',{
                form: form.toHTML(bootstrapField),
                variant: variant.toJSON()
            })
        }
    })
})



module.exports = router;