var express = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())

module.exports.countCookie = (req, res, next) => {
  var count; 
  var cookie = req.cookies.cookie;
  if (cookie === undefined) {
    // var randomNumber = Math.random().toString();
    // randomNumber = randomNumber.substring(2, 5);
    res.cookie("cookie", 0);
  } else {
    count = parseInt(req.cookies.cookie);
    count++;
    res.cookie("cookie", count);
  }
  console.log(`cookie: ${count}`);
  
  next();
};