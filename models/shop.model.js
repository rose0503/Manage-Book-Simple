var mongoose = require("mongoose");

var sessionSchema = new mongoose.Schema({
    id: String,
    userId: String,
    name: String,
    listBook: [ 
      { idBook: String, status: Boolean }
    ],
    status:{
        type: Boolean,
        default: true
      }
});

var Shops = mongoose.model('Shops', sessionSchema, 'Shops');
module.exports = Shops;