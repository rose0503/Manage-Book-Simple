const bcrypt = require("bcrypt");
const saltRounds = 10;

const db =require("../db.js");
const shortid = require('shortid');

module.exports.index = (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let perPage = 3;

  let start = (page - 1) * perPage;
  let end = page * perPage;
  
  var user = db.get('users').value();
  res.render('users/index',{
    users: user
  })
  console.log(db.get('users').value())
}

module.exports.create = (req, res) => {
  res.render('users/create')};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.isAdmin = false;
  req.body.wrongLoginCount = 0;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      req.body.password= hash;
  });
  db.get('users').push(req.body).write();
  res.redirect('/users');
};

module.exports.getId = (req, res) => {
  var id = req.params.id;
  var user = db.get('users').find({ id: id}).value();
  res.render('users/view',{
    user: user
  })
};

module.exports.edit = (req, res) => {
  var id = req.params.id;
  var user = db.get('users').find({ id: id}).value();
  res.render('users/edit',{ 
    user: user
  })
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get('users').remove({ id: id}).write();
  res.redirect('/users');
};

module.exports.postEdit = (req, res) => {
  var id = req.params.id;  
  db.get('users').find({ id: id}).assign({ name: req.body.name, age:req.body.age}).write();
  res.redirect('/users');
};