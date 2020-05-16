var express = require('express')
var router = express.Router()

const controller = require("../controllers/transaction.controller")

router.get("/", controller.index);

router.post('/create', controller.postCreate);

router.patch('/:id/complete', controller.complete);

module.exports = router; 