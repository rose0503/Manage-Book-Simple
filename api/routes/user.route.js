var express = require('express')
var router = express.Router()

const controller = require("../controllers/user.controller")
const validate = require("../../validations/user.validate");

const multer = require('multer');
const upload = multer({ dest: './public/uploads/' })
const requireLogin = require('../middleware/requireLogin')


router.get("/", controller.index);

router.post('/create', upload.single('avatar'), validate.postCreate, controller.postCreate);

router.get("/myuser",requireLogin, controller.getMyId);

router.delete('/:id/delete', controller.delete);

router.patch('/:id/edit', validate.postEdit, controller.postEdit);

module.exports = router;