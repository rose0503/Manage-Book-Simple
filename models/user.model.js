var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: String,
    name: String,
    age: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    wrongLoginCount: Number,
    avatar: String,
});

var User = mongoose.model('Users', userSchema, 'Users');
module.exports = User;