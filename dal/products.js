const {Product, Brand} = require('../models');

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

module.exports = {getAllProducts, getProductById}