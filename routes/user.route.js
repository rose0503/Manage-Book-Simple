var express = require('express')
var router = express.Router()

const controller = require("../controllers/user.controller")

router.get("/", controller.index);

router.get("/create", controller.create);

router.post('/create', controller.postCreate);

router.get("/:id", controller.getId);

router.get("/:id/edit", controller.edit);

router.get('/:id/delete', controller.delete);

router.post('/:id/edit', controller.postEdit);

module.exports = router;