var express = require('express')
var router = express.Router()

const controller =require("../controllers/auth.controller");
const {UserValidator} = require("../middleware/validator");
const requireLogin = require("../middleware/requireLogin")

router.post("/signup", UserValidator, controller.signup)

router.post("/signin", controller.postLogin)

router.get('/protected', requireLogin, (req, res) => {
    res.send('Hello hello');
})


module.exports = router;