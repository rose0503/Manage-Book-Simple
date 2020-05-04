const db = require("../db");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const shortid = require("shortid");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL
});

function checkIsImage(mimetype) {
  const acceptImageTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/x-icon"
  ];
  return acceptImageTypes.includes(mimetype);
}

module.exports.postCreate = (req, res, next) => {
  var error = [];

  if (!req.body.title) {
    error.push("Vui lòng nhập tiêu đề.");
  }
  if (!req.body.description) {
    error.push("Vui lòng nhập mô tả.");
  }
  if (!req.file ) {
    error.push("Image is required");
  }
  // if (req.file.mimetype === undefined) {
  //   error.push("Image is required");
  // }
  if (!checkIsImage(req.file.mimetype)) {
    error.push("Image is not valid");
  }
  console.log(req.file);
  const path = cloudinary.uploader
    .upload(req.file.path, {
      public_id: `student/${req.file.originalname}`,
      tags: "student"
    })
    .then(result => result.url)
    .catch(_ => false);
  if (!path)    
    error.push("There was an error saving your image");
  //console.log("path",path);
  if (error.length) {
    res.render("books/create", {
      errors: error,
      values: req.body
    });
    return;
  }
  //let pathBook = req.file.path.split('/').slice(1).join('/')
  const newBook = {
    title: req.body.title,
    description: req.body.description,
    id: shortid.generate(),
    coverUrl: path
  };
  console.log(newBook)
  db.get("books")
    .push(newBook)
    .write();
  // add dum data
  fs.unlinkSync(req.file.path);

  next();
};

module.exports.postEdit = (req, res, next) => {
  var error = [];
  if (!req.body.title) {
    error.push("Vui lòng nhập tiêu đề.");
  }
  if (error.length) {
    res.render("books/edit", {
      errors: error,
      values: req.body
    });
    return;
  }

  next();
};
