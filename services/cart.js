const cartDataLayer = require('../dal/cart')
const productsDataLayer = require('../dal/products')

async function addToCart( customerId, productVariantId, quantity) {
    //check stock if product variant
    const stock = await productsDataLayer.getStockOfProductVariant(productVariantId)
    const cart_item = await cartDataLayer.getCartItemByUserAndProduct(customerId, productVariantId)
        if (!cart_item) {
            //check if stock is more than quantity
            if (stock > quantity){
                await cartDataLayer.createCartItem(customerId, productVariantId, quantity);
                return true;
            } else {
                return false;
            } 
        } else {
            //check if stock is more than cartitem quantity + quantity
            let cartQuantity = cart_item.get('quantity')
            let newQuantity = quantity + cartQuantity
            if (stock > newQuantity){

                await cartDataLayer.updateQuantity(customerId, productVariantId, newQuantity);
                return true;
            } else {
                return false
            }
        }
}


async function getCart(customerId) {
    return cartDataLayer.getCart(customerId);
}

async function updateQuantity(customerId, productVariantId, newQuantity) {
    //TODO check if the quantity matches the business rule
    let stock = await productsDataLayer.getStockOfProductVariant(productVariantId)
    if (stock > 10 && stock > newQuantity) {
        return await cartDataLayer.updateQuantity(customerId, productVariantId, newQuantity)
    } else {
        return false;
    }
}

async function removeCartItem(customerId, productVariantId) {
    return await cartDataLayer.removeCartItem(customerId, productVariantId)
}

async function emptyCart(customerId) {
    const cartItems = await getCart(customerId);
    for (let item of cartItems) {
        productVariantId = item.get('product_variant_id');
        await removeCartItem(customerId, productVariantId)
    }
}

module.exports = { addToCart, getCart, updateQuantity, removeCartItem, emptyCart }