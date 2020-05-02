  
const multer = require("multer");
const upload = multer({
  dest: "public/uploads/"
});

const router = require("express").Router();
const controller = require("../controllers/profile.controller");

router.get("/", controller.index);
router.get("/updateAvatar", controller.avatarPage);
router.post("/updateAvatar", upload.single("avatar"), controller.changeAvatar);
// change password page
// router.get("/change-password", controller.changePasswordPage);
// router.post("/change-password", controller.changePassword);

module.exports = router;