var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  var transactions = db.get('transactions').value();
  var users = db.get('users').value();
  var books = db.get('books').value();
  var userId = transactions.map(function(tran) {
    return tran.userId
  });
  var user = transactions.filter(function(user){
    return userId == users.id
  })
  var bookId = transactions.map(function(tran) {
    return tran.bookId
  });
  var book = db.get('books').value().filter(function(book){
    return book.id = bookId
  })
  
  res.render('transactions/index',{
    transactions: transactions,
    users: user,
    books: book
  })
  console.log(user);
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
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
});


module.exports = router; 