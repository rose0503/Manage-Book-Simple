const db =require("../db.js");
const shortid = require('shortid');

module.exports.index =  (request, response) => {
  response.render("index");
}