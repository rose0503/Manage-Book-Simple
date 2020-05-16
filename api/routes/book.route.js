var express = require("express");
var router = express.Router();

const controller = require("../controllers/book.controller");
const validate = require("../../validations/book.validate");

const multer = require("multer");
const upload = multer({
  dest: './public/uploads/'
});

router.get("/", controller.index);

router.get("/:id", controller.getId);

router.post("/create", upload.single("avatar"), controller.postCreate);

router.patch("/:id/edit", validate.postEdit, controller.postEdit);

router.delete("/:id/delete", controller.delete);

module.exports = router;
