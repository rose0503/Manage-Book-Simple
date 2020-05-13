var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
  userId: String,
  bookId: [String],
  isComplete: {
    type: Boolean,
    default: false
  }
});

var Transaction = mongoose.model(
  "Transactions",
  transactionSchema,
  "Transactions"
);
module.exports = Transaction;
