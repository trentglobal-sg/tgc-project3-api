const express = require ('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')

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