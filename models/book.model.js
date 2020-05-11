var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    coverUrl: String
});

var Book = mongoose.model('Books', bookSchema, 'Books');
module.exports = Book;