const {Product, Brand, Category, Gender, Activity, Blend, Micron, Fit, Variant, Size} = require('../models');

async function getAllProducts(){
    return await Product.fetchAll({
        withRelated: ['brand']
    })
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

async function getProductVariants(productId){
    const variants = await Variant.collection().where({
        'product_id': productId
    }).fetch({
        require: false,
        withRelated: ['size', 'product']
    });
    return variants;
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
        withRelated: ['product', 'size']
    })
    return variant
}

module.exports = {getAllProducts, getProductById, getAllBrands, getAllCategories, getAllGenders, getAllActivities, getAllBlends, getAllMicrons, getAllFits, getProductVariants, getAllSizes, getVariantById}