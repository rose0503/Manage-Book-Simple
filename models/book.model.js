var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

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
    },
    createdBy:{
        type: ObjectId,
        ref: "Users"
    },
    byShop :{
        type: ObjectId,
        ref: "Shops"
    } 

},{timestamps:true});

var Book = mongoose.model('Books', bookSchema, 'Books');
module.exports = Book;