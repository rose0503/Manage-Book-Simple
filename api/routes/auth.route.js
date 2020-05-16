var express = require('express')
var router = express.Router()

const controller =require("../controllers/auth.controller");

router.post("/login", controller.postLogin)

router.post('/logout', controller.logout)

module.exports = router;