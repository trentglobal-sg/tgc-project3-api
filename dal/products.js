const {Product, Brand, Category, Gender, Activity, Blend, Micron, Fit, Variant, Size, Product_variant} = require('../models');

// async function getAllProducts(){
//     return await Product.fetchAll({
//         withRelated: ['brand']
//     })
// }

async function getAllProducts(){
    let allProductsData = await Product.fetchAll({
        withRelated: ['brand', 'gender', 'category']
    })
    let allProducts = allProductsData.toJSON();
    let newAllProducts = []
    for (let product of allProducts) {
        const stock = await getStockOfAllVariants(product.id)
        product = {...product, stock}
        newAllProducts.push(product)
    }
    return newAllProducts;
}

async function getProductById(productId){
    const product = await Product.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated: ['brand', 'category', 'gender', 'activity', 'blend', 'micron', 'fit']
    })
    return product;
}

async function getAllBrands(){
    const brands = await Brand.fetchAll().map(brand => {
        return [brand.get('id'), brand.get('brand')]
    });
    return brands;
}

async function getAllCategories(){
    const categories = await Category.fetchAll().map(category => {
        return [category.get('id'), category.get('category')]
    });
    return categories
}

async function getAllGenders(){
    const genders = await Gender.fetchAll().map(gender => {
        return [gender.get('id'), gender.get('gender')]
    });
    return genders
}

async function getAllActivities(){
    const activities = await Activity.fetchAll().map(activity => {
        return [activity.get('id'), activity.get('activity')]
    });
    return activities
}

async function getAllBlends(){
    const blends = await Blend.fetchAll().map(blend => {
        return [blend.get('id'), blend.get('blend')]
    });
    return blends
}

async function getAllMicrons(){
    const microns = await Micron.fetchAll().map(micron => {
        return [micron.get('id'), micron.get('micron')]
    });
    return microns
}

async function getAllFits(){
    const fits = await Fit.fetchAll().map(fit => {
        return [fit.get('id'), fit.get('fit')]
    });
    return fits
}

// async function getProductVariants(productId){
//     const variants = await Variant.collection().where({
//         'product_id': productId
//     }).fetch({
//         require: false,
//         withRelated: ['product']
//     });
//     return variants;
// }

async function getProductVariants(productId){
    const variantsData = await Variant.collection().where({
        'product_id': productId
    }).fetch({
        require: false,
        withRelated: ['product']
    });
    let variants = variantsData.toJSON();
    // console.log(variants)
    let newVariants = [];
    for (let variant of variants){
        const stock = await getStockOfVariant(variant.id);
        variant = {...variant, stock};
        newVariants.push(variant);
    }
    return newVariants;
}

async function getAllSizes(){
    const sizes = await Size.fetchAll().map(size => {
        return [size.get('id'), size.get('size')]
    });
    return sizes
}

async function getVariantById(variantId){
    const variant = await Variant.where({
        'id': variantId
    }).fetch({
        require: true,
        withRelated: ['product']
    })
    return variant
}

async function getAllProductVariantsByVariant(variantId){
    const productVariants = await Product_variant.collection().where({
        'variant_id': variantId
    }).fetch({
        require: false,
        withRelated: ['size']
    });
    return productVariants;
}

async function getProductVariantById(productVariantId){
    const productVariant = await Product_variant.where({
        'id': productVariantId
    }).fetch({
        require: true,
        withRelated: ['size']
    })
    return productVariant
}

async function getStockOfAllVariants(productId){
    //for each product, get all its variant ids
    let variantIds = []
    let allVariantsData = await getProductVariants(productId)
    let variants = allVariantsData
    variants.map(variant => {
        variantIds.push(variant.id)
    })
    // console.log(variantIds)

    let productStock = 0;
    //for each variant id, get all its product variants
    for (let variantId of variantIds) {
       const productVariantsData = await getAllProductVariantsByVariant(variantId);
    //    console.log(productVariantsData.toJSON())
       let productVariants = productVariantsData.toJSON()
        // loop through the product variants and extract the stock
        let variantStock = 0;
        productVariants.map(productVariant => {
            variantStock = variantStock + productVariant.stock
        })
        // console.log('variantstock:' + variantStock)
        productStock = productStock + variantStock
    }
    // console.log('productStock:' + productStock)
    return productStock;
}

async function getStockOfVariant(variantId){
    //for this variant, get its product variants
    const productVariantsData = await getAllProductVariantsByVariant(variantId);
    let productVariants = productVariantsData.toJSON();
    let variantStock = 0;
    productVariants.map(productVariant => {
        variantStock = variantStock + productVariant.stock
    })
    return variantStock;
    // console.log(variantStock)
}

module.exports = {getAllProducts, 
    getProductById, 
    getAllBrands, 
    getAllCategories, 
    getAllGenders, 
    getAllActivities, 
    getAllBlends, 
    getAllMicrons, 
    getAllFits, 
    getProductVariants, 
    getAllSizes, 
    getVariantById, 
    getAllProductVariantsByVariant, 
    getProductVariantById,
    getStockOfAllVariants,
    getStockOfVariant}