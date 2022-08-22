const express = require('express');
const router = express.Router();
const {checkIfAuthenticatedJWT} = require('../../middlewares');
const cartServices = require('../../services/cart');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', async function (req, res) {
    //step1: create a line item
    //each item in the shopping cart is a line item
    // TODO const cartData = await cartServices.getCart(req.customer.id);
    const cartData = await cartServices.getCart(1);
    items = cartData.toJSON();

    let lineItems = [];
    let meta = []; //store for each product id how many the user is buying (quantity). line items structure has no place to put productid
    for (let item of items) {
        //each key in line item is fixed by stripe
        const eachLineItem = {
            'name': item.product_variant.variant.product.product + ', ' + item.product_variant.variant.color_name + ', ' + item.product_variant.size.size,
            'amount': item.product_variant.variant.product.cost,
            'quantity': item.quantity,
            'currency': 'SGD',
        }
        //check if there is an image
        if (item.product_variant.variant.variant_image_url) {
            //stripe expects images to be an array
            eachLineItem.images = [item.product_variant.variant.variant_image_url];
            lineItems.push(eachLineItem);
        }

        console.log(lineItems)

        meta.push({
            // TODO 'customer_id': req.customer.id,
            'customer_id': 1,
            'product_variant_id': item.product_variant_id,
            'quantity': item.quantity
        })

        console.log(meta)
    }

    //step2: create a stripe payment
    //the meta data must be a string
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card', 'paynow', 'grabpay'], //check stripe documentation for diff payment options
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_CANCEL_URL,
        //in metadata, keys are up to us but value must be a string
        metadata: {
            'orders': metaData,
        },
        shipping_address_collection: {
            allowed_countries: ['SG']
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1000,
                        currency: 'sgd',
                    },
                    display_name: 'Standard Shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        }
                    }
                }
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'sgd',
                    },
                    display_name: 'Express Shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        }
                    }
                }
            }
        ]
    }

    //step3: register the payment session
    let stripeSession = await Stripe.checkout.sessions.create(payment)


    //step 4: user stripe to pay
    //credit card information (no, ccv) can NEVER reach our server
    res.render('landing/testCheckout',{
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

router.get('/success', function (req,res){
    res.send('payment success')
})

router.get('/cancelled', function(req,res){
    res.send('payment failed')
})

//webhook for stripe
//has to be post - 1. we are changing the db based on payment info 2. stripe decides
router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
    console.log("process started")
    let payload = req.body; //payment info is indside req.body
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET; //each webhook will have one endpoint secret to ensure stripe is the one sending information to us
    let sigHeader = req.headers["stripe-signature"]; //when stripe send us the info, there will be a signature in the header
    let event = null;
    //try to extract out the information and ensures that it comes from stripe
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
        console.log(event)
        
        if (event.type == 'checkout.session.completed' || event.type == 'checkout.session.async_payment_succeeded') {
            console.log(event.data.object)
            let shippingRateId = event.data.object.shipping_rate;
            const metaData = JSON.parse(event.data.object.metadata.orders);
            console.log(metaData);

            const shippingRate = await Stripe.shippingRates.retrieve(shippingRateId);
            console.log(shippingRate)
            //need to send a reply back to stripe or stripe will keep retrying
            res.send({
                'success': true
            })
            
        };
        //get receipt and payment mode
        if (event.type == 'charge.succeeded') {
            const chargeData = event.data.object
            console.log(chargeData);
            res.send({
                'success': true
            })
        };

    } catch (e) {
        res.sendStatus(500)
        res.send({
            'error': e.message
        })
        console.log(e.message)
    }
})


module.exports = router;