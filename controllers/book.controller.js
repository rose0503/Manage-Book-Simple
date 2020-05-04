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

module.exports.index =  (req, res) => {
  res.render('books/index',{
    books: db.get('books').value()
  })
  console.log(db.get('books').value())
}

 module.exports.create = (req, res) => {
  res.render('books/create')
 };

module.exports.getId = (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/view',{
    book: book
  })
};

module.exports.edit = (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/edit',{ 
    book: book
  })
};

module.exports.postEdit =  (req, res) => {
  var id = req.params.id;
  db.get('books').find({ id: id}).assign({ title: req.body.title}).write();
  res.redirect('/books');
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get('books').remove({ id: id}).write();
  res.redirect('/books');
};

module.exports.postCreate = (req, res) => {
  // req.body.id = shortid.generate();
  // db.get('books').push(req.body).write();
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
  let pathBook = req.file.path.split('/').slice(1).join('/')
  const newBook = {
    title: req.body.title,
    description: req.body.description,
    id: shortid.generate(),
    coverUrl: pathBook
  };
  console.log(newBook)
  db.get("books")
    .push(newBook)
    .write();
  // add dum data
  fs.unlinkSync(req.file.path);
  res.redirect('/books');
};

module.exports.sreach = (req, res) => {
  var q = req.query.q;
  var matchBooks = db.get("books").value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 
  })
  res.render('books/view',{
    book: matchBooks,
    q: q
  })
};

