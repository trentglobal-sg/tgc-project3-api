const {Product, Brand, Category, Gender, Activity, Blend, Micron, Fit} = require('../models');

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

module.exports = {getAllProducts, getProductById, getAllBrands, getAllCategories, getAllGenders, getAllActivities, getAllBlends, getAllMicrons, getAllFits}