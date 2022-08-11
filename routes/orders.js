const express = require("express");

//create a router object, can contain routes
const router = express.Router();

router.get('/', function(req,res){
    res.render("orders/index");
})

module.exports = router;