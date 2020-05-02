const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const db = require("../db");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  CLOUDINARY_URL:  process.env.CLOUDINARY_URL
});

module.exports.index = (req, res) => {
  const id = req.signedCookies.userId;

  var user = db.get('users').find({ id: id}).value();
  res.render('profiles/index',{
    auth: user
  })
};

module.exports.avatarPage = (req, res) => {
  const id = req.signedCookies.userId;
  var user = db.get('users').find({ id: id}).value();
  res.render('profiles/updateAvatar',{
    auth: user
  }) 
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
    var user = db.get('users').find({ id: id}).value();
//   const user = req.user;
  try {
    
    if (!req.file) {
      res.render("profiles/updateAvatar", { auth: user, error: ["Avatar is required"]});
    }
    if (!checkIsImage(req.file.mimetype)) {
      res.render("profiles/updateAvatar", { auth: user, error: ["Avatar is not valid"]});
    }

    const path = await cloudinary.uploader
      .upload(req.file.path, {
        public_id: `student/${req.file.filename}`,
        tags: "student"
      })
      .then(result => result.url)
      .catch(_ => false);
    if (!path) 
      res.render("profiles/updateAvatar", { auth: user, error: ["There was an error saving your avatar"]});
      //throw new Exception("There was an error saving your avatar");
    db.get("users")
      .find({ id: user.id })
      .assign({ avatar: path })
      .write();
    fs.unlinkSync(req.file.path);
    res.redirect("/profiles");
  } catch (error) {
    res.render("profiles/avatar", { auth: user, error: error.message});
  }
};