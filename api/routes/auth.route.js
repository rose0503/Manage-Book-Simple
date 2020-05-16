var express = require('express')
var router = express.Router()

const controller =require("../controllers/auth.controller");

router.post("/login", controller.postLogin)

router.get('/logout', controller.logout)

module.exports = router;