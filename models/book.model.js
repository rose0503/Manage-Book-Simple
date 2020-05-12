// var mongoose = require("mongoose");

// var bookSchema = new mongoose.Schema({
//     title: String,
//     description: String,
//     coverUrl: String
// });

// var Book = mongoose.model('Books', bookSchema, 'Books');
// module.exports = Book;

const { Schema, model } = require("mongoose");

const bookSchema = Schema({
  title: String,
  description: String,
  imgUrl: String
});

module.exports = model("Book", bookSchema);