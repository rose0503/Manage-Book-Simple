const db = require("../db")

module.exports = {
  cart:  (req, res, next) => {    
    // var id = req.params.id;
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  var session=  db.get('sessions').find({id: sessionId}).value()
  
  var count = db.get('sessions').find({id: sessionId}).get('cart.' + id, 0).value();
  console.log("count",count);
  db.get('sessions').find({id: sessionId}).set("cart." + id, count + 1).write();
  const cartArr = session.cart;
  //console.log("cartid", session.cart)
  let result = 0;
  for(let a of Object.keys(cartArr))
    result += cartArr[a];
  res.locals.countBooks = result;
    next();
  }
};
