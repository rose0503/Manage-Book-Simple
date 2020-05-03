const db = require("../db")

module.exports = {
  cart: async (req, res, next) => {    
    const id = req.signedCookies.sessionId;
    const sessions = db.get("sessions").find({id : id}).value();
    // count book add cart
    await sessions.find({}).then(doc => {
      const cartArr = doc[0].cart;
      let result = cartArr.reduce((acc, cur) => {
        return (acc += cur.count);
      }, 0);
      res.locals.countBooks = result;
    });

    next();
  }
};
