var express = require('express')
var router = express.Router()

const controller =require("../controllers/cart.controller");
const requireLogin = require('../middleware/requireLogin')

router.post("/addCart",requireLogin, controller.postCart)

module.exports = router;