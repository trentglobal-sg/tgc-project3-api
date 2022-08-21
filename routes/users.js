const express = require('express')
const router = express.Router();
const {createLoginForm, createUserForm, bootstrapField} = require('../forms')
const {User} = require('../models')
const { checkIfAuthenticated} = require('../middlewares')
const usersDataLayer = require('../dal/users')
const {getHashedPassword} = require('../utilities')

router.get('/', async (req,res)=>{
    const allUsers = await usersDataLayer.getAllUsers()

    res.render('users', {
        users: allUsers
    })
})

router.get('/register', async (req,res)=>{
    const allRoles = await usersDataLayer.getAllRoles()
    const registerForm = createUserForm(allRoles)

    res.render('users/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', (req,res)=>{
    const registerForm = createUserForm();

    registerForm.handle(req,{
        'success': async (form) => {
            const password = getHashedPassword(form.data.password)
            const userData = {
                username: form.data.username,
                email : form.data.email,
                password: password,
                role_id: form.data.role_id
            }
            const user = await usersDataLayer.registerUser(userData)

            // const user = await usersDataLayer.registerUser(form.data);
            req.flash("success_messages", "User successfully added")
            res.redirect('/users')
        },
        'error': async(form) => {
            req.flash("error_messages", "Please ensure there are no errors in the form fields")
            res.render('users/register', {
                "form": form.toHTML(bootstrapField)
            })
        },
    })
})

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