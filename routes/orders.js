const express = require("express");
const router = express.Router();
const ordersDataLayer = require('../dal/orders')
const {updateOrderForm, bootstrapField, createOrderSearchForm} = require('../forms')
const {Order} = require('../models')

router.get('/', async function(req,res){
    const allOrders = await ordersDataLayer.getAllOrders();
    const orderStatus = await ordersDataLayer.getAllOrderStatus();
    orderStatus.unshift([0, '-----']);

    let orderSearchForm = createOrderSearchForm(orderStatus);
    let query = Order.collection()

    orderSearchForm.handle(req,{
        'success': async(form)=>{
            if (form.data.id){
                query.where('id', '=', form.data.id)
            }

            if (form.data.order_status_id && form.data.order_status_id != '0'){
                query.where('order_status_id', '=', form.data.order_status_id)
            }

            if (form.data.email){
                if(process.env.DB_DRIVER == 'mysql'){
                    query.query('join', 'customers', 'customers.id', 'customer_id')
                    .where('email', 'like', `%${form.data.email}%`)
                } else {
                    query.query('join', 'customers', 'customers.id', 'customer_id')
                    .where('email', 'ilike', `%${form.data.email}%`)
                }
            }

            let ordersData = await query.fetch({
                withRelated:['order_status', 'customer', 'order_item']
            })

            let orders = ordersData.toJSON();

            res.render('orders/index', {
                orders : orders,
                form: form.toHTML(bootstrapField)
            })
        },
        'empty': async (form)=>{
            res.render("orders/index" ,{
                orders: allOrders.toJSON(),
                form: orderSearchForm.toHTML(bootstrapField)
            });
        }
    })
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