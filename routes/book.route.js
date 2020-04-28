var express = require('express')
var router = express.Router()

const controller =require("../controllers/book.controller")

router.get("/", controller.index);

router.get("/create", controller.create);

router.get("/:id", controller.getId);

router.get("/:id/edit", controller.edit);

router.post('/:id/edit',controller.postEdit);

router.get('/:id/delete', controller.delete);

router.post('/create', controller.postCreate);

router.get("/sreach", controller.sreach);


module.exports = router;