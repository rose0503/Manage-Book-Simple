var express = require('express')
var router = express.Router()

const controller =require("../controllers/auth.controller");
//const validate = require("../validations/book.validate")

router.get("/login", controller.login);

router.post("/login", controller.postLogin)

router.get('/logout', controller.logout)
module.exports = router;