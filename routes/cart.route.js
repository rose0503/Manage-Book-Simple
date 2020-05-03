var express = require('express')
var router = express.Router()

const controller =require("../controllers/cart.controller");

router.get("/add/:id", controller.addToCart);

module.exports = router;