var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;

var sessionSchema = new mongoose.Schema({
    userId: {
      type: ObjectId,
      ref: "Users"
    },
    name: {
      type : String,
      required: true
    },
    listBook: [ 
      { 
        bookId: {      
          type: ObjectId,
          ref: "Books"
        },
        isStatus: {
          type: Boolean,
          default: true
        },
      }
    ],
    status:{
        type: Boolean,
        default: true
      }
},{timestamps:true});

var Shops = mongoose.model('Shops', sessionSchema, 'Shops');
module.exports = Shops;