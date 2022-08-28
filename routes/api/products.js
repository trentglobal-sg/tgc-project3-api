const express = require ('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')
const { Product } = require ('../../models')

//get all products
router.get('/', async (req,res) => {
    try{
        const allProducts = await productDataLayer.getAllProductsApi()
        const allBrands = await productDataLayer.getAllBrands()
        const allCategories = await productDataLayer.getAllCategories()
        const allBlends = await productDataLayer.getAllBlends()
        const allMicrons = await productDataLayer.getAllMicrons()
        const allFits = await productDataLayer.getAllFits()
        const allGenders = await productDataLayer.getAllGenders()
        const allActivities = await productDataLayer.getAllActivities()
        
        allData = {allProducts, allBrands, allCategories, allBlends, allMicrons, allFits, allGenders, allActivities}
    
        res.send(allData)
    } catch (error) {
        res.send(error)
    }
})

router.get('/search', async(req,res)=>{
    let query = Product.collection();
    // console.log(req.query)
    if (req.query.product) {
        if(process.env.DB_DRIVER == 'mysql'){
            query.where('product', 'like', '%' + req.query.product + '%')
        } else {
            query.where('product', 'ilike', '%' + req.query.product + '%')
        }
    };

    if (req.query.brand_id && req.query.brand_id != '1'){
        query.where('brand_id', '=', req.query.brand_id)
    };

    if (req.query.category_id && req.query.category_id != '1'){
        query.where('category_id', '=', req.query.category_id)
    }

    if (req.query.activity_id && req.query.activity_id != '1'){
        query.where('activity_id', '=', req.query.activity_id)
    }

    if(req.query.blend_id && req.query.blend_id != '1'){
        query.where('blend_id', '=', req.query.blend_id)
    }

    let productsData = await query.fetch({
        withRelated: ['brand', 'gender', 'category']
    })

    let products = productsData.toJSON();
    res.send(products)
    // console.log(products) 
})

router.get('/search-fields', async(req,res)=>{
    try{
        const brandsData = await productDataLayer.getAllBrands()
        const categoriesData = await productDataLayer.getAllCategories()
        const activitiesData = await productDataLayer.getAllActivities()
        const blendsData = await productDataLayer.getAllBlends()
        let searchFields = {brandsData, categoriesData, activitiesData, blendsData}

        res.send(searchFields)
    }catch(error){
        res.send(error)
    }
})

//get variants by product id
router.get('/:product_id', async(req,res)=>{
    try{
        const variantsData = await productDataLayer.getVariantsApi(req.params.product_id)
        const variants = variantsData.toJSON()
        res.send(variants)
    } catch (error) {
        res.send(error)
    }
})

//get product variants by variant id
router.get('/:product_id/:variant_id', async (req,res)=>{
    try{
        const productVariantsData = await productDataLayer.getAllProductVariantsByVariant(req.params.variant_id)
        const productVariants = productVariantsData.toJSON()
        res.send(productVariants)
    } catch(error){
        res.send(error)
    }
})




module.exports = router;