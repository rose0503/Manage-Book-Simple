const cloudinary = require("cloudinary").v2;
const fs = require("fs");

var Book = require("../models/book.model");

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

module.exports.index = async (req, res) => {
  let books = await Book.find({});
  return res.status(200).json({
    books: books
  })
  // res.render("books/index", {
  //   books: books
  // });
};

module.exports.create = (req, res) => {
  res.render("books/create");
};

module.exports.getId = async (req, res) => {
  var id = req.params.id;
  const book = await Book.findOne({ _id: id });
  res.render("books/view", {
    book: book
  });
};

module.exports.edit = async (req, res) => {
  var id = req.params.id;
  const book = await Book.findOne({ _id: id });
  res.render("books/edit", {
    book: book
  });
};

module.exports.postEdit = async (req, res) => {
  var id = req.params.id;  
  await Book.findByIdAndUpdate(id, { title: req.body.title });
  res.redirect("/books");
};

module.exports.delete = async (req, res) => {
  var id = req.params.id;  
  await Book.findByIdAndRemove({ _id: id });
  res.redirect("/books");
};

module.exports.postCreate = async (req, res) => {
  var error = [];

  if (!req.body.title) {
    error.push("Vui lòng nhập tiêu đề.");
  }
  if (!req.body.description) {
    error.push("Vui lòng nhập mô tả.");
  }
  if (!req.file) {
    error.push("Image is required");
  }
  // if (req.file.mimetype === undefined) {
  //   error.push("Image is required");
  // }
  // if (!checkIsImage(req.file.mimetype)) {
  //   error.push("Image is not valid");
  // }
  // console.log(req.file);
  // const path = cloudinary.uploader
  //   .upload(req.file.path, {
  //     public_id: `student/${req.file.originalname}`,
  //     tags: "student"
  //   })
  //   .then(result => result.url)
  //   .catch(_ => false);
  // if (!path)
  //   error.push("There was an error saving your image");
  //console.log("path",path);
  if (error.length) {
    res.render("books/create", {
      errors: error,
      values: req.body
    });
    return;
  }
  let pathBook = req.file.path
    .split("/")
    .slice(1)
    .join("/");
  console.log("pathBook", pathBook);
  const newBook = new Book({
    title: req.body.title,
    description: req.body.description,
    coverUrl: req.file.path
      .split("/")
      .slice(1)
      .join("/")
  }); 
  await newBook.save();

  // add dum data
  fs.unlinkSync(req.file.path);
  res.redirect("/books");
};
