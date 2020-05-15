const shortid = require("shortid");
const db = require("../db");
var Session = require("../models/session.model");

let sessionId = shortid.generate();
module.exports.session = async (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    res.cookie("sessionId", sessionId, { signed: true });
  }
  var newSession = new Session({
    id: sessionId,
    cart: {}
  });
  //await newSession.save();
  //db.get("sessions").push({ id: sessionId }).write();
  console.log("newSessionId" , newSession)

  next();
};
