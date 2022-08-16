const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);



// create an instance of express app
const app = express();

// set up sessions
app.use(session({
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// set the view engine
app.set("view engine", "hbs");


// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// set up partials
hbs.registerPartials('./views/partials');

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use(flash());
//setup a middleware
app.use(function (req, res, next) {
  //res.locals will contain all variables available to hbs files
  res.locals.success_messages = req.flash("success_messages");
  res.locals.error_messages = req.flash("error_messages");
  next();
});

//ROUTES
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cloudinaryRoutes = require('./routes/cloudinary');


async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes);
    app.use('/cloudinary', cloudinaryRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server started");
});