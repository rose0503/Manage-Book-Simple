
const db =require("../db.js");
const shortid = require('shortid');

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

