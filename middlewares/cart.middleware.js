//const db = require("../db")

var Session = require("../models/session.model");

module.exports = {
  cart: async (req, res, next) => {   
  var sessionId = req.signedCookies.sessionId;
  var session = await Session.findOne({id: sessionId})
  //console.log("session result", session)
  let cartArr;
    
  if(session.cart==undefined || session.cart==null) {
    cartArr = {};    
  }else {
    cartArr = session.cart;
  }
  //console.log("cartid", cartArr)
  let result = 0;
    
  for(let a of cartArr)
    result += a.count;
  res.locals.countBooks = result;
  //console.log("result", result)
  next();
  }
};
