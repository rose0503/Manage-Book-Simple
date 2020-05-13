// const db =require("../db.js");
// const shortid = require('shortid');
var User = require("../models/user.model");

module.exports.index = async (request, response) => {
  //var user = db.get("users").find({id: request.signedCookies.userId}).value();
  const user = await User.findOne({_id : request.signedCookies.userId});
  response.render("index", {
    user: user
  });
}