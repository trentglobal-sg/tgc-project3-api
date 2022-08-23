const express = require ('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')

router.get('/', async (req,res) => {
    const allProducts = await productDataLayer.getAllProductsApi()
    const allBrands = await productDataLayer.getAllBrands()
    const allCategories = await productDataLayer.getAllCategories()
    const allBlends = await productDataLayer.getAllBlends()
    const allMicrons = await productDataLayer.getAllMicrons()
    const allFits = await productDataLayer.getAllFits()
    const allGenders = await productDataLayer.getAllGenders()
    const allActivities = await productDataLayer.getAllActivities()
    
    allData = {
        products: allProducts.toJSON(),
        brands: allBrands,
        categories: allCategories,
        blends: allBlends,
        microns: allMicrons,
        fits: allFits,
        genders: allGenders,
        activities: allActivities
    }

    res.send(allData)
})

module.exports = router;