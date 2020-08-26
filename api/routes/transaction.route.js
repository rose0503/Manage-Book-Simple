var express = require('express')
var router = express.Router()

const controller = require("../controllers/transaction.controller")
const requireLogin = require('../middleware/requireLogin')

router.get("/", controller.index);

router.get('/getid', requireLogin, controller.getTransId); 

// router.post('/create', controller.postCreate);

router.patch('/complete/:id',requireLogin, controller.complete);

module.exports = router; 