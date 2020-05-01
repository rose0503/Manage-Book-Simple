const bcrypt = require("bcrypt");
const saltRounds = 10;

const db =require("../db.js");
const shortid = require('shortid');

module.exports.index = (req, res) => {
  var user = db.get('users').value();
  
  let page = parseInt(req.query.page) || 1;
  let perPage = 3;

  let start = (page - 1) * perPage;
  let end = page * perPage;
  
  let pageSize = Math.ceil(user.length / 3);

  let paginationSizes = pageSize >= 3 ? 3 : pageSize;

  let pageCurrent = parseInt(req.query.page);
  
  res.render('users/index',{
    users: user,
    listUser: user.slice(start, end),
    paginationSize: paginationSizes,
    pageSize: pageSize,
    page_Current: pageCurrent
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