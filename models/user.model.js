var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true      
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    wrongLoginCount: {
      type: Number,
      default: 0
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/quocviet0503/image/upload/v1595881667/default-avatar_haphbj.png"
    },
    age:{
      type: Number,
      required: false,
      min: 1,
      max: 100
    },
  }
);

var User = mongoose.model("Users", userSchema, "Users");
module.exports = User;
