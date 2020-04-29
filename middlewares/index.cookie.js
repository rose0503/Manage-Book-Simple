var express = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())

module.exports.countCookie = (req, res, next) => {
  var count=0; 
  var cookie = req.cookies.cookie;
  if (cookie === undefined) {
    
    res.cookie("cookie", 0);
  } else {
    count = parseInt(req.cookies.cookie);
    count++;
    res.cookie("cookie", count);
  }
  console.log(`cookie: ${count}`);
  
  next();
};