const express = require("express");
const router = express.Router();
const dataLayer = require('../dal/products');
const { createProductForm, bootstrapField, createVariantForm, createProductVariantForm, createSearchForm } = require('../forms');
const { Product, Variant, Product_variant, Brand } = require("../models");


router.get('/', async function (req, res) {
    let allProducts = await dataLayer.getAllProducts();
    
    const allBrands = await dataLayer.getAllBrands();
    allBrands.unshift([0, '-----']);
    const allGenders = await dataLayer.getAllGenders();
    allGenders.unshift([0, '-----']);
    const allCategories = await dataLayer.getAllCategories();
    allCategories.unshift([0, '-----'])

    let searchForm = createSearchForm(allBrands, allGenders, allCategories);
    let query = Product.collection();

    searchForm.handle(req, {
        'success': async (form) => {
            if (form.data.id){
                query.where('id', '=', form.data.id)
            };
            if (form.data.product) {
                if(process.env.DB_DRIVER == 'mysql'){
                    query.where('product', 'like', '%' + form.data.product + '%')
                } else {
                    query.where('product', 'ilike', '%' + form.data.product + '%')
                }
            };
            if (form.data.brand_id && form.data.brand_id != '0'){
                query.where('brand_id', '=', form.data.brand_id)
            };
            if (form.data.min_cost){
                query.where('cost', '>=', form.data.min_cost*100)
            };
            if (form.data.max_cost){
                query.where('cost', '<=', form.data.max_cost*100)
            }
            if (form.data.gender_id && form.data.gender_id != '0'){
                query.where('gender_id', '=', form.data.gender_id)
            }
            if (form.data.category_id && form.data.category_id != '0'){
                query.where('category_id', '=', form.data.category_id)
            }

            let productsData = await query.fetch({
                withRelated: ['brand', 'gender', 'category']
            })

            let products = productsData.toJSON();
            // console.log(products) 

            //get stock for seach results
            let newProducts = []
            for (let product of products) {
                const stock = await dataLayer.getStockOfAllVariants(product.id);
                const sold = await dataLayer.getSoldOfAllVariants(product.id);
                const revenue = parseInt(parseInt(sold) * product.cost)
                product = { ...product, stock, sold, revenue }
                newProducts.push(product)
            }
            // console.log(newProducts)

            res.render("products/index", {
                'products': newProducts,
                'form': form.toHTML(bootstrapField)
            });
        },
        'empty': async () => {
            let products = allProducts
            res.render("products/index", {
                'products': products,
                'form': searchForm.toHTML(bootstrapField)
            });
        },
        'error': async () => {
            let products = allProducts
            res.render("products/index", {
                'products': products,
                'form': searchForm.toHTML(bootstrapField)
            });
        },
    })
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
            // console.log(saved.toJSON())

            let newProduct = saved.toJSON();
            //add in flash messages
            req.flash('success_messages', `New product ${newProduct.product} has been created`)
            res.redirect('/products/' + newProduct.id + '/create-variant')
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
    // console.log(variants.toJSON())

    res.render('products/product', {
        'product': product.toJSON(),
        'variants': variants
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
    const productData = product.toJSON();
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

            // add flash messages
            req.flash('success_messages', `Product ${productData.product} updated`)
            res.redirect('/products/' + req.params.product_id);
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

router.post('/:product_id/delete', async function(req,res){
    //fetch product we want to delete
    const product = await dataLayer.getProductById(req.params.product_id)

    await product.destroy()
    res.redirect('/products')
})

router.get('/:product_id/create-variant', async function (req, res) {
    const variantForm = createVariantForm()
    const product = await dataLayer.getProductById(req.params.product_id)

    res.render('products/create-variant', {
        form: variantForm.toHTML(bootstrapField),
        product: product.toJSON(),
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

            const newVariant = saved.toJSON();

            // add flash messages
            req.flash('success_messages', `New variant ${newVariant.color_name} has been created`)
            res.redirect('/products/' + req.params.product_id + '/variants/' + newVariant.id + '/add-product-variant') 
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

router.get('/:product_id/variants/:variant_id', async function (req, res) {
    const productVariants = await dataLayer.getAllProductVariantsByVariant(req.params.variant_id);
    const product = await dataLayer.getProductById(req.params.product_id);
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    res.render('products/product-variant', {
        productVariants: productVariants.toJSON(),
        variantId: req.params.variant_id,
        productId: req.params.product_id,
        product: product.toJSON(),
        variant: variant.toJSON()
    })
})

router.get('/:product_id/variants/:variant_id/add-product-variant/', async function (req, res) {
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const sizes = await dataLayer.getAllSizes();
    const productVariantForm = createProductVariantForm(sizes);

    res.render('products/create-product-variant', {
        form: productVariantForm.toHTML(bootstrapField),
        variant: variant.toJSON(),
        product_id: req.params.product_id
    })
})

router.post('/:product_id/variants/:variant_id/add-product-variant/', async function (req, res) {
    const productData = await dataLayer.getProductById(req.params.product_id)
    const product = productData.toJSON()
    const variantData = await dataLayer.getVariantById(req.params.variant_id)
    const variant = variantData.toJSON()
    const sizes = await dataLayer.getAllSizes();
    const productVariantForm = createProductVariantForm(sizes);

    productVariantForm.handle(req, {
        'success': async (form) => {
            const variant_id = req.params.variant_id
            const product_variant_data = { ...form.data, variant_id }
            const product_variant = new Product_variant(product_variant_data)
            const saved = await product_variant.save()

            //add flash message
            req.flash('success_messages', `New product variant for ${product.product} - ${variant.color_name} has been created`)
            res.redirect('/products/' + req.params.product_id + '/variants/' + req.params.variant_id)
        },
        'error': async (form) => {
            res.render('products/create-product-variant', {
                form: form.toHTML(bootstrapField),
                variant: variant,
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/update-product-variant/:product_variant_id', async function (req, res) {
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const sizes = await dataLayer.getAllSizes();
    const productVariant = await dataLayer.getProductVariantById(req.params.product_variant_id);
    const productVariantForm = createProductVariantForm(sizes);

    productVariantForm.fields.stock.value = productVariant.get('stock');
    productVariantForm.fields.size_id.value = productVariant.get('size_id');

    res.render('products/update-product-variant', {
        form: productVariantForm.toHTML(bootstrapField),
        variant: variant.toJSON(),
        productVariant: productVariant.toJSON(),
        productId: req.params.product_id,
        variantId: req.params.variant_id,
        productVariantId: req.params.product_variant_id
    })
})

router.post('/:product_id/variants/:variant_id/update-product-variant/:product_variant_id', async function (req, res) {
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const sizes = await dataLayer.getAllSizes();
    const productVariant = await dataLayer.getProductVariantById(req.params.product_variant_id);
    const productVariantForm = createProductVariantForm(sizes);

    productVariantForm.handle(req, {
        'success': async (form) => {
            productVariant.set(form.data);
            productVariant.save();

            // add flash messages
            req.flash('success_messages', `Product variant updated`)
            res.redirect('/products/' + req.params.product_id + '/variants/' + req.params.variant_id);
        },
        'error': async (form) => {
            res.render('products/update-product-variant', {
                form: form.toHTML(bootstrapField),
                variant: variant.toJSON(),
                productVariant: productVariant.toJSON(),
                productId: req.params.product_id,
                variantId: req.params.variant_id,
                productVariantId: req.params.product_variant_id
            })
        }
    })
})

router.post('/:product_id/variants/:variant_id/delete-product-variant/:product_variant_id', async function(req,res){
    //fetch the product variant that we want to delete
    const productVariant = await dataLayer.getProductVariantById(req.params.product_variant_id)

    await productVariant.destroy();
    res.redirect('/products/' + req.params.product_id + '/variants/' + req.params.variant_id)
})

router.get('/:product_id/update-variant/:variant_id', async function (req, res) {
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const product = await dataLayer.getProductById(req.params.product_id)
    // console.log(variant.toJSON())
    const variantForm = createVariantForm();

    //fill in the form fields
    variantForm.fields.color_code.value = variant.get('color_code');
    variantForm.fields.color_name.value = variant.get('color_name');
    variantForm.fields.variant_image_url.value = variant.get('variant_image_url');
    variantForm.fields.variant_thumbnail_url.value = variant.get('variant_thumbnail_url');

    res.render('products/update-variant', {
        form: variantForm.toHTML(bootstrapField),
        variant: variant.toJSON(),
        product: product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update-variant/:variant_id', async function (req, res) {
    const variant = await dataLayer.getVariantById(req.params.variant_id);
    const variantForm = createVariantForm();

    variantForm.handle(req, {
        'success': async (form) => {
            variant.set(form.data);
            variant.save();

            // add flash messages
            req.flash('success_messages', `Variant updated`)
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

router.post('/:product_id/delete-variant/:variant_id', async function (req,res){
    //fetch the variant that we want to delete
    const variant = await dataLayer.getVariantById(req.params.variant_id)

    await variant.destroy();
    res.redirect('/products/' + req.params.product_id)
})


module.exports = router;