const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {Customer, Blacklisted_token} = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

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
router.post('/refresh',async function (req, res) {
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