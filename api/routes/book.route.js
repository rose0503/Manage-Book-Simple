var express = require("express");
var router = express.Router();

const controller = require("../controllers/book.controller");
const validate = require("../../validations/book.validate");
const requireLogin = require('../middleware/requireLogin')

router.get("/", controller.index);

router.get("/:id", controller.getId);

router.get("/cart/:_id", controller.addToCart);

router.post("/create",requireLogin, controller.postCreate);

router.patch("/:id/edit", validate.postEdit, controller.postEdit);

router.delete("/:id/delete", controller.delete);


module.exports = router;
