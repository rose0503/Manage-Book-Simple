//const db = require("../db")

var Session = require("../models/session.model");

module.exports = {
  cart: async (req, res, next) => {
    //   var sessionId = req.signedCookies.sessionId;
    //   console.log("sessionId", sessionId)
    //   //var session=  db.get('sessions').find({id: sessionId}).value()
    //   var session = await Session.findOne({id: sessionId})
    //   console.log("session", session)
    //   let cartArr;

    //   if(session.cart==undefined || session.cart==null) {
    //     cartArr = {};
    //   }else {
    //     cartArr = session.cart;
    //   }
    //   console.log("cartid", cartArr)
    //   let result = 0;

    //   for(let a of Object.keys(cartArr))
    //     result += cartArr[a];
    //   res.locals.countBooks = result;
    const id = req.signedCookies.sessionId;
    // count book add cart
    await Session.find({}).then(doc => {
      const cartArr = doc[0].cart;
      let result = cartArr.reduce((acc, cur) => {
        return (acc += cur.count);
      }, 0);
      res.locals.countBooks = result;
    });
    next();
  }
};
