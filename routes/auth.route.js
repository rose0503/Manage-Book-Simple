var express = require('express')
var router = express.Router()

const controller =require("../controllers/auth.controller");
//const validate = require("../validations/book.validate")

router.get("/login", controller.login);

module.exports = router;