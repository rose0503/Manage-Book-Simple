var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render('transactions/index',{
    transactions: db.get('transactions').value(),
    users: db.get("transactions").value(),
    books: db.get("books").value()
  })
});

router.get("/create", (req, res) => {
  res.render('transactions/create.pug', {
    users: db.get("users").value(),
    books: db.get("books").value(),
  })
});


router.post('/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('transactions').push(req.body.user.id, req.body.book.id).write();
  res.redirect('/transactions');
});


module.exports = router; 