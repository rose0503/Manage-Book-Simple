//const db = require("../db")

var User = require("../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.signedCookies.userId){
    res.redirect("/auth/login");
    return;
  }
  
  //var user = db.get("users").find({id: req.signedCookies.userId}).value();
  
   const user = await User.findOne({ _id: req.signedCookies.userId });
  // find user
  //const user = users.find(item => item.email === email);
  
  
  if(!user){
    res.redirect("/auth/login");
    return;
  }
  res.locals.user = user;
  next();
}