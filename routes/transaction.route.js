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
  var user = users.filter(function(user){
    for(var x of userId)
        if(user.id === x)
          
          return user
  })
  var bookId = transactions.map(function(tran) {    
    return tran.bookId
  });
  var book = books.filter(function(book){
    for(let x of bookId)
      if(book.id === x)
        return book
  })
  
  res.render('transactions/index',{
    transactions: transactions,
    users: user,
    books: book
  })
  console.log(bookId);
  console.log(book);
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