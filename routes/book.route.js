var express = require('express')
var router = express.Router()

const controller =require("../controllers/book.controller");
const validate = require("../validations/book.validate");

const multer = require('multer');
const upload = multer({
  dest: "public/uploads/"
});

router.get("/", controller.index);

router.get("/create", controller.create);

router.get("/:id", controller.getId);

router.get("/:id/edit", controller.edit);

router.post('/:id/edit', validate.postEdit, controller.postEdit);

router.get('/:id/delete', controller.delete);

router.post('/create', upload.single('avatar'),controller.postCreate);

router.get("/sreach", controller.sreach);


module.exports = router;