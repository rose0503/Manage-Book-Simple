const db = require("../db")

module.exports = {
  cart:  (req, res, next) => {    
    const id = req.signedCookies.sessionId;
    const session= db.get("sessions").find({id : id}).value();
    // count book add cart
     //sessions.find({id : id}).then(doc => {
    
      const cartArr = session.cart ? session.cart : [];
      let result = cartArr.reduce((acc, cur) => {
        return (acc += cur.count);
      }, 0);
      res.locals.countBooks = result;
    //});
    console.log(cartArr)
    next();
  }
};
