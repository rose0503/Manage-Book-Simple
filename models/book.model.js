var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    coverUrl: String
});

var Book = mongoose.model('CRUD-Book.Books', bookSchema, 'CRUD-Book.Books');
module.exports = Book;