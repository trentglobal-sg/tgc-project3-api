const {Order, Order_item, Order_status} = require('../models')

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


//TODO test orders sorting
const getAllOrders = async () =>{
    const allOrders = await Order.fetchAll({
        withRelated:['order_status', 'customer']
    })
    return allOrders;
}

const getAllOrderStatus = async ()=>{
    const orderStatus = await Order_status.fetchAll().map(status => {
        return [status.get('id'), status.get('order_status')]
    });
    return orderStatus
}

const getOrderById = async (orderId)=>{
    const order = await Order.where({
        'id': orderId
    }).fetch({
        require: true,
        withRelated:['order_status', 'customer']
    })
    return order;
}

const getOrdersByCustomerId = async (customerId)=>{
    const orders = await Order.collection().where({
        'customer_id': customerId
    }).orderBy('id', 'DESC').fetch({
        require: false,
        withRelated:['order_status', 'customer']
    })
    return orders
}

module.exports = {
    createOrder,
    createOrderItem,
    getAllOrders,
    getAllOrderStatus,
    getOrderById,
    getOrdersByCustomerId
}