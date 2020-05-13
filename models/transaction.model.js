var mongoose = require("mongoose");

var transactionSchema = new mongoose.Schema({
    userId: String,
    bookId: [],
    coverUrl: String
});

var Transaction = mongoose.model('Transactions', transactionSchema, 'Transactions');
module.exports = Transaction;