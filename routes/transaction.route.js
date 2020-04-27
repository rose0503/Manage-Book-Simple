var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  var transactions = db.get('transactions').value();
  var userId = transactions.userId;
  var user = db.get('users').filter({ id: userId}).value();
  var bookId = transactions.bookId;
  var book = db.get('books').filter({ id: bookId}).value();
  res.render('transactions/index',{
    transactions: transactions,
    users: user,
    books: book
  })
  console.log(db.get('transactions').value())
});


router.get("/create", (req, res) => {
  res.render('transactions/create.pug', {
    users: db.get("users").value(),
    books: db.get("books").value(),
  })
});


router.post('/create', (req, res) => {
  req.body.id = shortid.generate();
  var userId =req.body.user;
  var bookId =req.body.book;
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
});


module.exports = router; 