const db =require("../db.js");
const shortid = require('shortid');

module.exports.index = (req, res) => {
  var transactions = db.get('transactions').value();
  var users = db.get('users').value();
  var books = db.get('books').value();
  res.render('transactions/index',{
    transactions: transactions,
    users: users,
    books: books
  })  
};

module.exports.create = (req, res) => {
  res.render('transactions/create.pug', {
    users: db.get("users").value(),
    books: db.get("books").value(),
  })
};

module.exports.complete