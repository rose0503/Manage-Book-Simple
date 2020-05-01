const db = require("../db");
let cookies_req = {};
let counter = 0;
var user = db.get("users").value();

module.exports.isAdmin= (req, res, next) => {
    try {
      // check isAdmin
      const idUser = req.cookies.userId;
      console.log(idUser)
      if (!idUser) {
        res.locals.isAdmin = false;
      } 
      else {
        const u = db.get("users").find({ id: idUser }).value();        
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

// module.exports.isUser = (req, res, next) => {
//     // isUser
//     var u = db.get("users").find({ id: req.cookies.userId }).value()
//     res.locals.user = u;
//     next();
//   };
