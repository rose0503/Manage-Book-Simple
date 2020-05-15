var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema(
  {
    id: String,
    cart: [{ bookId: String, count: Number }]
  }
);

var Session = mongoose.model("Sessions", sessionSchema, "Sessions");
module.exports = Session;
