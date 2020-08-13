var mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types;
var transactionSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "Users"
  },
  bookRent: [
    {
      bookId: {      
        type: ObjectId,
        ref: "Books"
      },
      isComplete: {
        type: Boolean,
        default: false
      },
      dateRent: {
        type: Date,
        default: Date.now()
      },
      dateBack: {
        type: Date,
        default: null
      }
    }   
  ]
},{timestamps:true});

var Transaction = mongoose.model("Transactions",transactionSchema,"Transactions");
module.exports = Transaction;
