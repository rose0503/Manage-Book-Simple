var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
  cart: { bookId: Number }
}, {
    versionKey: false // You should be aware of the outcome after set to false
});

var Session = mongoose.model("Sessions", sessionSchema, "Sessions");
module.exports = Session;
