//const db = require("../db")

var Session = require("../models/session.model");

module.exports = {
  cart: async (req, res, next) => {   
  var sessionId = req.signedCookies.sessionId;
  //var session=  db.get('sessions').find({id: sessionId}).value()
  var session = await Session.findOne({id: sessionId})
    
  let cartArr;
    
  if(!session.cart) {
    cartArr = {};
    
  }else {
    cartArr = session.cart;
  }
  console.log("cartid", cartArr)
  let result = 0;
    
  for(let a of Object.keys(cartArr))
    result += cartArr[a];
  res.locals.countBooks = result;
  
    next();
  }
};
