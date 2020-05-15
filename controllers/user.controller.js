const bcrypt = require("bcrypt");
const saltRounds = 10;

const db =require("../db.js");
const shortid = require('shortid');

var User = require("../models/user.model");

function generatePagination(page, paginationSizes, numPages) {
    let startLink = -1;
    // add skip '...'
    let addition = {
      start: false, // add skip at start
      end: false // add skip at end
    };
    if (page < paginationSizes) {
      // current page  at start
      startLink = 0;
      addition.end = numPages > paginationSizes ? true : false;
    } else if (numPages - page <= paginationSizes) {
      // current page  at end
      startLink = numPages - paginationSizes;
      addition.start = true;
    } else {
      // current page  at middle
      startLink = Math.floor(page / paginationSizes) * paginationSizes;
      addition.start = true;
      addition.end = true;
    }
    let pageLinks = Array.from({ length: paginationSizes }, (_, index) => {
      return startLink + index;
    });

    if (addition.start) {
      pageLinks.unshift(0, false);
    }

    if (addition.end) {
      pageLinks.push(false, numPages - 1);
    }
    return pageLinks;
  };

module.exports.index =async (req, res) => {
  //const query = db.get("users");
  const query = await User.find({});
  console.log("query", query);
  var user = [];
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 4;

  const length = query.length;

  // num of pages
  const numPages = Math.ceil(length / limit);

  // size of a pagination bar: default 5
  const paginationSizes = numPages >= 3 ? 3 : numPages;
  if (page >= numPages) {
    page = numPages - 1;
  }
  // skip
  const skip = page * limit;
  // const users = query
  //   .drop(skip)
  //   .take(limit)
  //   .value();
  user = query.slice(skip, skip + limit);
  const links = generatePagination(page, paginationSizes, numPages);
  return res.render("users/index", {
    users: user,
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

module.exports.postCreate = async (req, res) => {
  //req.body.id = shortid.generate();
  var avatar = req.file.path.split('/').slice(1).join('/');
  var pwd;
  //req.body.isAdmin = false;
  //req.body.wrongLoginCount = 0;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
       pwd= hash;
  });
  console.log("new password", pwd)
  const newUser = new User({
      name: req.body.name,
      password: pwd,
      email:req.body.email,
      age: req.body.age,
      avatar,
    });
  console.log("new user", newUser)
  //await newUser.save();
  //db.get('users').push(req.body).write();
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