const cloudinary = require("cloudinary").v2;
const fs = require("fs");

var Book = require("../models/book.model");
const { slice } = require("lodash");

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

module.exports.index = async (req, res, next) => {
  try{
    // var _limit = res.params._limit || 6;
    // var _page = req.query._page || 1
    // var start = (_page - 1 ) * _limit;
    // var end = _page * _limit;
  let books = await Book.find()
  
  // var a; 
  // a.foo();
  res.render("books/index", {
    books: books
  });}catch (error){
    res.status(500).render("error/500", {
    message: error ? error.message : "Internal server error"
  });
  }
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

// module.exports.sreach = (req, res) => {
//   var q = req.query.q;
//   var matchBooks = db.get("books").value().filter((book) => {
//     return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1
//   })
//   res.render('books/view',{
//     book: matchBooks,
//     q: q
//   })
// };
