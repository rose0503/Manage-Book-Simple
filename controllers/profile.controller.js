const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const db = require("../db");

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
  res.render('profiles/index',{
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
//   const user = req.user;
//   try {
//     if (!req.file) {
//       res.render("profiles/updateAvatar", { auth: user, error: ["Avatar is required"]});
//       //throw new Exception("Avatar is required");
//     }
//     if (!checkIsImage(req.file.mimetype)) {
//       res.render("profiles/updateAvatar", { auth: user, error: ["Avatar is not valid"]});
//       //throw new Exception("Avatar is not valid");
//     }

//     const path = await cloudinary.uploader
//       .upload(req.file.path, {
//         public_id: `student/${req.file.filename}`,
//         tags: "student"
//       })
//       .then(result => result.url)
//       .catch(_ => false);
//     if (!path) throw new Exception("There was an error saving your avatar");
//     db.get("users")
//       .find({ id: user.id })
//       .assign({ avatar: path })
//       .write();
//     fs.unlinkSync(req.file.path);
//     res.redirect("/profiles");
//   } catch (error) {
//     res.render("profile/avatar", { auth: user, error: error.message });
//   }
};