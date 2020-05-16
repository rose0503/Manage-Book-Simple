const cloudinary = require("cloudinary").v2;
const fs = require("fs");
var User = require("../../models/user.model");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL
});

module.exports.index = async (req, res) => {
  try {
    const id = req.signedCookies.userId;
    const user = await User.findOne({ _id: id });
    //console.log("profile user", user)

    return res.status(200).json({
      auth: user
    });
  } catch ({ message = "Invalid request" }) {
    return res.status(400).json({ message });
  }
};

module.exports.avatarPage = async (req, res) => {
  const id = req.signedCookies.userId;
  const user = await User.findOne({ _id: id });

  return res.status(200).json({
    auth: user
  });
};
/**
 * Check file is image of ['image/png', 'image/jpeg']
 * @param {string} mimetype
 */
function checkIsImage(mimetype) {
  const acceptImageTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/x-icon"
  ];
  return acceptImageTypes.includes(mimetype);
}

module.exports.changeAvatar = async (req, res) => {
  const id = req.signedCookies.userId;
  const user = await User.findOne({ _id: id });

  try {
    if (!req.file) {
      res.render("profiles/updateAvatar", {
        auth: user,
        error: ["Avatar is required"]
      });
    }
    if (!checkIsImage(req.file.mimetype)) {
      res.render("profiles/updateAvatar", {
        auth: user,
        error: ["Avatar is not valid"]
      });
    }

    const path = await cloudinary.uploader
      .upload(req.file.path, {
        public_id: `student/${req.file.filename}`,
        tags: "student"
      })
      .then(result => result.url)
      .catch(_ => false);
    if (!path)
      res.render("profiles/updateAvatar", {
        auth: user,
        error: ["There was an error saving your avatar"]
      });

    await User.findByIdAndUpdate(user._id, { avatar: path });

    fs.unlinkSync(req.file.path);

    return res.status(200).json({ user });
  } catch ({ message = "Invalid request" }) {
    return res.status(400).json({ message });
  }
};
