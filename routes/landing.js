const express = require("express");
const {createLoginForm, createUserForm, bootstrapField} = require('../forms')
//create a router object, can contain routes
const router = express.Router();
const {getHashedPassword} = require('../utilities')
const {User} = require('../models')

router.get('/', function(req,res){
    const loginForm = createLoginForm()

    res.render("landing/index",{
        form: loginForm.toHTML(bootstrapField)
    });
})

router.post('/', (req,res)=>{
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
                res.redirect('/');
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
            res.render('/', {
                'form': form.toHTML(bootstrapField)
            })
        },
    })
})

router.get('/about-us', function(req,res){
    res.render("landing/about");
})

router.get("/contact-us", function(req,res){
    res.render("landing/contact")
})

module.exports = router;