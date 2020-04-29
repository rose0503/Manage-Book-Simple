var express = require('express')
var router = express.Router();

const controller =require("../controllers/index.controller");
const cookie = require("../middlewares/index.cookie")

router.get("/", cookie.countCookie, controller.index);

module.exports = router;