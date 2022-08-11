const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
});

// create an instance of express app
const app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);


//ROUTES
const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');


async function main() {
    app.use('/', landingRoutes);
    app.use('/products', productRoutes);
    app.use('/orders', orderRoutes)
}

main();

app.listen(3000, () => {
  console.log("Server started");
});