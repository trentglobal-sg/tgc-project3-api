const express = require('express')
const router = express.Router();
const crypto = require('crypto')
const {createLoginForm, bootstrapField} = require('../forms')
const {User} = require('../models')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/login', (req,res)=>{
    const loginForm = createLoginForm()

    res.render('users/login', {
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', (req,res)=>{
    const loginForm = createLoginForm();

    loginForm.handle(req,{
        'success': async (form) => {
            //process login
            // ...find the user by email and password
            const user = await User.where({
                'email': form.data.email,
                'password': getHashedPassword(form.data.password)
            }).fetch({
                require: false
            });

            //check if the user does not exist
            if (!user) {
                req.flash("error_messages", "Sorry, wrong email or password.")
                res.redirect('/users/login');
            } else {
                // store the user details
                req.session.user = {
                    id: user.get('id'),
                    username: user.get('username'),
                    email: user.get('email')
                }
                req.flash("success_messages", "Welcome back, " + user.get('username'));
                res.redirect('/users/profile');
            }
        },
        'error': async (form) => {
            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })
        },
    })
})

module.exports = router;