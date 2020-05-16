const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});

const router = require("express").Router();
const controller = require("../controllers/profile.controller");

router.get("/", controller.index);

router.get("/updateAvatar", controller.avatarPage);

router.patch("/updateAvatar", upload.single("avatar"), controller.changeAvatar);

module.exports = router;
