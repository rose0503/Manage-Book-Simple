
const db =require("../db.js");
const shortid = require('shortid');

module.exports.index =  (req, res) => {
  res.render('books/index',{
    books: db.get('books').value()
  })
}

 module.exports.create = (req, res) => {
  res.render('books/create')
 };