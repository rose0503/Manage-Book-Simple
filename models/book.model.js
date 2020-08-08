var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title: {
        type : String,
        required: true
    },
    description: {
        type: String,
        required:true
    },
    coverUrl: {
        type: String,
        default : "https://res.cloudinary.com/quocviet0503/image/upload/v1596661882/default-book-icon_bcxisi.png"
    }
    

},{timestamps:true});

var Book = mongoose.model('Books', bookSchema, 'Books');
module.exports = Book;