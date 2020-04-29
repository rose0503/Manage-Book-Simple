var express = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())

module.exports.countCookie = (req, res, next) => {
  var count;
  //while(true){  
  res.cookie("cookie", "123")
  console.log(req.cookie)
  count;
 //} 
  
  next();
};