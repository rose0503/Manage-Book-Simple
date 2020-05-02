var express = require('express')
var router = express.Router()

const controller = require("../controllers/user.controller")
const validate = require("../validations/user.validate");
const profileController = require("../controllers/profile.controller")

const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })

router.get("/", controller.index);

router.get("/create", controller.create);

router.post('/create', upload.single('avatar'), validate.postCreate, controller.postCreate);

router.get("/:id", controller.getId);

router.get("/:id/edit", controller.edit);

router.get('/:id/delete', controller.delete);

router.post('/:id/edit', validate.postEdit, controller.postEdit);

module.exports = router;