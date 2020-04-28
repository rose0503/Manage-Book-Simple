const db =require("../db.js");
const shortid = require('shortid');

module.exports.index = (req, res) => {
  res.render('users/index',{
    users: db.get('users').value()
  })
}