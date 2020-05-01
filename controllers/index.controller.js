const db =require("../db.js");
const shortid = require('shortid');

module.exports.index =  (request, response) => {
  var user = db.get("users").find({id: request.signedCookies.userId}).value();
  response.render("index", {
    user: user
  });
}