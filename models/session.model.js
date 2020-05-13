var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    cart: {}
});

var Session = mongoose.model('Sessions', sessionSchema, 'Sessions');
module.exports = Session;