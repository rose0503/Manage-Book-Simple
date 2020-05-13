const db = require("../db");
// var user = db.get("users").value();

var User = require("../models/user.model");

module.exports.isAdmin= async (req, res, next) => {
    try {
      // check isAdmin
      const idUser = req.signedCookies.userId;
      console.log(idUser)
      if (!idUser) {
        res.locals.isAdmin = false;
      } 
      else {
        //const u = db.get("users").find({ id: idUser }).value();     
        const u = await User.findOne({ _id: idUser });
        if (!u.isAdmin ) {
          res.locals.isAdmin = false;
        } else {
          res.locals.isAdmin = true;
        }
      
      }
      //console.log("local admin",res.locals.isAdmin)
      next();
    } catch (err) {
      console.log(err);
    }
  }

module.exports.isUser = async (req, res, next) => {
    // isUser
    //var u = db.get("users").find({ id: req.signedCookies.userId }).value()
    const u = await User.findOne({ _id: req.signedCookies.userId });
    res.locals.user = u;
    next();
  };
