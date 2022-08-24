const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {Customer, Blacklisted_token} = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const {validateEmail} = require('../../utilities')
const customerDataLayer = require('../../dal/customers')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAccessToken = function (username, id, email, tokenSecret, expiry) {
    //first arg == payload (public can see)
    //second arg == tokensecret
    return jwt.sign({
        'username': username,
        'id': id,
        'email': email
    }, tokenSecret, {
        expiresIn: expiry
    })
}

router.post('/register', async function(req,res) {
    let error = {};
    const username = req.body.username;
    if (username.length == 0 || username.length > 100) {
        error.name = "Please choose a username of less than 100 characters"
    }

    const first_name = req.body.first_name;
    if (first_name.length == 0 || first_name.length > 100) {
        error.first_name = "Please enter first name of less than 100 characters"
    }

    const last_name = req.body.last_name;
    if (last_name.length == 0 || last_name.length > 100) {
        error.first_name = "Please enter last name of less than 100 characters"
    }

    const email  = req.body.email;
    if (!validateEmail(email)) {
        error.email = "Please enter a valid email address"
    }

    const password = req.body.password;
    if (password.length == 0 || password.length > 100 || password.length < 8) {
        error.password = "Please choose a password between 8 and 100 characters "
    }

    const contact_number = req.body.contact_number;
    if(contact_number.length == 0 || contact_number.length > 12) {
        error.contact_number = "Please enter contact number of less than 12 characters"
    }

    if (Object.keys(error).length > 0){
        res.status(400);
        res.json({error: error});
        return
    }

    const customerData = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: getHashedPassword(password),
        contact_number: contact_number,
        created_date: new Date(),
    }

    // res.json(customerData)
    try {
        const customer = await customerDataLayer.registerCustomer(customerData);
        res.status(201);
        res.json({customer: customer})
    } catch (error) {
        res.status(500)
        res.json({error: "Internal server error. Please contact administrator"})
        console.log(error)
    }
})


router.post('/login', async function (req, res) {
    const customer = await Customer.where({
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
    }).fetch({
        require: false
    })

    if (customer) {
        //create the jwt
        const accessToken = generateAccessToken(customer.get('username'), customer.get('id'), customer.get('email'), process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateAccessToken(customer.get('username'), customer.get('id'), customer.get('email'), process.env.REFRESH_TOKEN_SECRET, '7d')
        res.json({
            'accessToken': accessToken,
            'refreshToken': refreshToken
        })
    } else {
        //error
        res.status(401);
        res.json({
            'message': 'Invalid email or password'
        })
    }
})

router.get('/profile', checkIfAuthenticatedJWT, function (req, res) {
    const customer = req.customer;
    res.json({
        "customer": customer
    })
})

//get a new access token
router.post('/refresh', checkIfAuthenticatedJWT, async function (req, res) {
    const refreshToken = req.body.refreshToken;
    if (refreshToken) {
        //check if token is already blacklist
        const blacklisted_token = await Blacklisted_token.where({
            'blacklisted_token': refreshToken
        }).fetch({
            require: false
        })

        //if the blaclisted token is not null, means it exists
        if(blacklisted_token){
            res.status(400);
            res.json({
                'error': 'Refresh token has been blacklisted'
            })
            return;
        }

        //verify if legit
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, tokenData) {
            if (!err) {
                //generate a new access token and send back
                const accessToken = generateAccessToken(tokenData.username,
                    tokenData.id,
                    tokenData.email,
                    process.env.TOKEN_SECRET,
                    '1h');
                res.json({
                    accessToken: accessToken
                })
            } else {
                res.status(401);
                res.json({
                    'error': 'No token found'
                })
            }
        })
    } else {
        res.status(401);
        res.json({
            'error': 'No refresh token found'
        })
    }
})

router.post('/logout', checkIfAuthenticatedJWT,async function(req,res){
    const refreshToken = req.body.refreshToken;

    if(refreshToken){
        //add refresh token to black list
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function(err, tokenData){
            if (!err){
                //check if token is already blacklist
                const blacklistedToken = await Blacklisted_token.where({
                    'blacklisted_token': refreshToken
                }).fetch({
                    require: false
                })

                //if the blaclisted token is not null, means it exists
                if(blacklistedToken){
                    res.status(400);
                    res.json({
                        'error': 'Refresh token has been blacklisted'
                    })
                    return;
                }

                // add to blacklist
                const token = new Blacklisted_token();
                token.set('blacklisted_token', refreshToken);
                token.get('created_date', new Date());
                await token.save();
                res.json({
                    'message': 'logged out'
                })
            }
        })
    } else {
        res.status(401);
        res.json({
            'error': 'No refresh token found'
        })
    }
})



module.exports = router;