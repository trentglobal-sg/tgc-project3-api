const cartDataLayer = require('../dal/cart')
const productsDataLayer = require('../dal/products')

async function addToCart(customerId, productVariantId, quantity) {
    //check stock if product variant
    const stock = await productsDataLayer.getStockOfProductVariant(productVariantId)
    const cart_item = await cartDataLayer.getCartItemByUserAndProduct(customerId, productVariantId)
    if (stock > quantity) {
        if (!cart_item) {
            await cartDataLayer.createCartItem(customerId, productVariantId, quantity);
            return true;
        } else {
            await cartDataLayer.updateQuantity(customerId, productVariantId, cart_item.get('quantity') + quantity);
            return true;
        }
    } else {
        return false;
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