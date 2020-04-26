var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render('transactions/index',{
    transactions: db.get('transactions').value()    
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
  var userId =req.body.value;
  var bookId =req.body.value;
  db.get('transactions').push(req.body.value).write();
  res.redirect('/transactions');
});


module.exports = router; 