const db =require("../db.js");
const shortid = require('shortid');

module.exports.index =  (request, response) => {
  //response.cookie("cookie", "")
  console.log()
  response.render("index");
}