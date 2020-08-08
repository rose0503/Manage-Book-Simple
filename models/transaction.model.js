var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;
var transactionSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "Users"
  },
  bookRent: [{
    bookId: {      
      type: ObjectId,
      ref: "Books"
    }, 
    date : {
      type: Date
    }
    
  }],
  isComplete: {
    type: Boolean,
    default: false
  }
},{timestamps:true});

var Transaction = mongoose.model("Transactions",transactionSchema,"Transactions");
module.exports = Transaction;
