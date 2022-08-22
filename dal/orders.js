const {Order, Order_item} = require('../models')

const createOrder = async (orderData) =>{
    const order = new Order(orderData);
    await order.save();
    return order;
};

const createOrderItem = async (orderItemData) => {
    const order_item = new Order_item(orderItemData);
    await order_item.save();
    return order_item;
}

const getAllOrders = async () =>{
    const allOrders = await Order.fetchAll({
        withRelated:['order_status', 'customer', 'order_item']
    })
    return allOrders;
}

module.exports = {
    createOrder,
    createOrderItem,
    getAllOrders
}