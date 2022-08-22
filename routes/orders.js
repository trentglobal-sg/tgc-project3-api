const express = require("express");
const router = express.Router();
const ordersDataLayer = require('../dal/orders')
const {updateOrderForm, bootstrapField} = require('../forms')

router.get('/', async function(req,res){
    const allOrders = await ordersDataLayer.getAllOrders();

    res.render("orders/index" ,{
        orders: allOrders.toJSON(),
    });
})

router.get('/:order_id', async function(req,res){
    const order = await ordersDataLayer.getOrderById(req.params.order_id);
    const orderStatus = await ordersDataLayer.getAllOrderStatus();

    const updateForm = updateOrderForm(orderStatus);
    updateForm.fields.order_status_id.value = order.get('order_status_id')
    updateForm.fields.remarks.value = order.get('remarks')

    res.render('orders/order', {
        order: order.toJSON(),
        form: updateForm.toHTML(bootstrapField)
    })
})

router.post('/:order_id', async function(req,res){
    const order = await ordersDataLayer.getOrderById(req.params.order_id);
    const orderStatus = await ordersDataLayer.getAllOrderStatus();

    const updateForm = updateOrderForm(orderStatus);

    updateForm.handle(req, {
        'success': async (form) =>{
            updated_date = new Date()
            updateOrderData = {...form.data, updated_date}

            order.set(updateOrderData);
            order.save();

            req.flash('success_messages', `Order ${req.params.order_id} updated`);
            res.redirect('/orders/' + req.params.order_id)
        },
        'error': async (form)=>{
            res.render('orders/order', {
                order: order.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;