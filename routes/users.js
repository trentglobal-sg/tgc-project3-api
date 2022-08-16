const express = require('express')
const router = express.Router();
const crypto = require('crypto')
const {createLoginForm, bootstrapField} = require('../forms')
const {User} = require('../models')
const { checkIfAuthenticated} = require('../middlewares')

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
                'username': form.data.username,
                'password': getHashedPassword(form.data.password)
            }).fetch({
                require: false
            });

            //check if the user does not exist
            if (!user) {
                req.flash("error_messages", "Sorry, wrong username or password.")
                res.redirect('/users/login');
            } else {
                // store the user details
                req.session.user = {
                    id: user.get('id'),
                    username: user.get('username'),
                    email: user.get('email'),
                    role_id: user.get('role_id')
                }
                req.flash("success_messages", "Welcome back, " + user.get('username'));
                res.redirect('/products');
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

router.get('/logout', (req, res) => {
    req.session.user = null;
    req.flash('success_messages', "Goodbye");
    res.redirect('/users/login');
})

router.get('/register',checkIfAuthenticated, (req,res)=>{
    res.render('users/register')
})

module.exports = router;