const db =require("../db.js");
const shortid = require('shortid');

module.exports.index = (req, res) => {
  res.render('users/index',{
    users: db.get('users').value()
  })
}

module.exports.create = (req, res) => {
  res.render('users/create')};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  var error = [];
  
  if(!req.body.name){
    error.push('Vui lòng nhập họ tên.');
  }
  if((req.body.name).length > 30){
    error.push('Tên phải nhỏ hơn 30 ký tự.');
  }
  
  if(!req.body.age){
    error.push('Vui lòng nhập tuổi.');
  }
  if(error.length){
    res.render('users/create',{
      errors: error ,
      values: req.body
    })
    return;
  }
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
  res.render('users/edit')
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get('users').remove({ id: id}).write();
  res.redirect('/users');
};

module.exports.postEdit = (req, res) => {
  var id = req.params.id;
  var error = [];
  
  if(!req.body.name){
    error.push('Vui lòng nhập họ tên.');
  }
  if((req.body.name).length > 30){
    error.push('Tên phải nhỏ hơn 30 ký tự.');
  }
  
  if(!req.body.age){
    error.push('Vui lòng nhập tuổi.');
  }
  if(error.length){
    res.render('users/edit',{
      errors: error ,
      values: req.body
    })
    return;
  }
  db.get('users').find({ id: id}).assign({ name: req.body.name, age:req.body.age}).write();
  res.redirect('/users');
};