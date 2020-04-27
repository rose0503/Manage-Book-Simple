var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render('books/index',{
    books: db.get('books').value()
  })
  console.log(db.get('books').value())
});

router.get("/create", (req, res) => {
  res.render('books/create')});

router.get("/:id", (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/view',{
    book: book
  })
});

router.get("/:id/edit", (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/edit',{ 
    book: book
  })
});

router.post('/:id/edit', (req, res) => {
  var id = req.params.id;
  db.get('books').find({ id: id}).assign({ title: req.body.title}).write();
  res.redirect('/books');
});

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;
  db.get('books').remove({ id: id}).write();
  res.redirect('/books');
});

router.post('/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

router.get("/sreach", (req, res) => {
  var q = req.query.q;
  var matchBooks = db.get("books").value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 
  })
  res.render('books/view',{
    book: matchBooks,
    q: q
  })
});


module.exports = router;