const express = require("express");

//create a router object, can contain routes
const router = express.Router();

router.get('/', function(req,res){
    res.render("products/index");
})

module.exports = router;