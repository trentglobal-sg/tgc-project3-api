const { Cart_item } = require('../models')

const getCart = async (customerId) => {
    return await Cart_item.collection()
        .where({
            'customer_id' : customerId
        }).fetch({
            require: false,
            withRelated: ['product_variant', 'product_variant.variant', 'product_variant.variant.product']
        })
}


const createCartItem = async (customerId, productVariantId, quantity) => {
    const cart_item = new Cart_item({
        'customer_id': customerId,
        'product_variant_id': productVariantId,
        'quantity': quantity
    })
    await cart_item.save();
    return cart_item
}

const getCartItemByUserAndProduct = async (customerId, productVariantId) => {
    return await Cart_item.where({
        'customer_id': customerId,
        'product_variant_id': productVariantId
    }).fetch({
        require: false,
        withRelated: ['product_variant', 'product_variant.variant', 'product_variant.variant.product']
    })
}

const updateQuantity = async (customerId, productVariantId, newQuantity) => {
    const cart_item = await getCartItemByUserAndProduct(customerId, productVariantId);
    if(cart_item){
        cart_item.set('quantity', newQuantity);
        await cart_item.save();
    } else {
        return false;
    }
}

const removeCartItem = async (customerId, productVariantId) => {
    const cart_item = await getCartItemByUserAndProduct(customerId, productVariantId);
    await cart_item.destroy();
    return true;
}

module.exports = {getCart, createCartItem, getCartItemByUserAndProduct, updateQuantity, removeCartItem}