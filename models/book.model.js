var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title: String,
    description: String,
    coverUrl: String
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

var Book = mongoose.model('Book', bookSchema, 'Books');
module.exports = Book;