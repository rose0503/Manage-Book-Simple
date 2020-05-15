var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    name: String,
    age: String,
    email: String,
    password: String,
    isAdmin: {
      type: Boolean,
      default: false
    },
    wrongLoginCount: {
      type: Number,
      default: 0
    },
    avatar: String
  },
  {
    versionKey: false // You should be aware of the outcome after set to false
  }
);

var User = mongoose.model("Users", userSchema, "Users");
module.exports = User;
