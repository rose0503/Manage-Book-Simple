const shortid = require("shortid");

module.exports = (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    res.cookie("sessionId", shortid.generate(), { signed: true });
  }
  
  next();
};
