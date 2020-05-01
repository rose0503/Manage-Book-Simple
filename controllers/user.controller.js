const bcrypt = require("bcrypt");
const saltRounds = 10;

const db =require("../db.js");
const shortid = require('shortid');

// module.exports.index = (req, res) => {
//   var user = db.get('users').value();
  
//   let page = parseInt(req.query.page) || 1;
//   let perPage = 4;

//   let start = (page - 1) * perPage;
//   let end = page * perPage;
  
//   let pageSize = Math.ceil(user.length / 3);

//   let paginationSizes = pageSize >= 3 ? 3 : pageSize;

//   let pageCurrent = parseInt(req.query.page);
  
//   res.render('users/index',{
//     users: user,
//     listUser: user.slice(start, end),
//     paginationSize: paginationSizes,
//     pageSize: pageSize,
//     page_Current: pageCurrent
//   })
//   console.log(db.get('users').value())
// }

module.exports.index = (req, res) => {
  const query = db.get("users");
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 3;

  const length = query.size().value();

  // num of pages
  const numPages = Math.ceil(length / limit);

  // size of a pagination bar: default 5
  const paginationSizes = numPages >= 5 ? 5 : numPages;
  if (page >= numPages) {
    page = numPages - 1;
  }
  // skip
  const skip = page * limit;
  const users = query
    .drop(skip)
    .take(limit)
    .value();
  const links = generatePagination(page, paginationSizes, numPages);
  return res.render("user/index", {
    users,
    auth: req.user,
    pagination: {
      links,
      numPages,
      page,
      limit,
      start: skip
    }
  });
};

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