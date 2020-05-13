const db = require("../db")

module.exports = {
  cart:  (req, res, next) => {   
  var sessionId = req.signedCookies.sessionId;
  var session=  db.get('sessions').find({id: sessionId}).value()
  
  let cartArr;
    
  if(session.cart) {
    cartArr = session.cart;
  }else {
    cartArr = {};
  }
  console.log("cartid", cartArr)
  let result = 0;
    
  for(let a of Object.keys(cartArr))
    result += cartArr[a];
  res.locals.countBooks = result;
  
    next();
  }
};
