const bcrypt = require("bcrypt");
const saltRounds = 10;

const db =require("../db.js");
const shortid = require('shortid');

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

module.exports.index = (req, res) => {
  const query = db.get("users");
  // query params
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 4;

  const length = query.size().value();

  // num of pages
  const numPages = Math.ceil(length / limit);

  // size of a pagination bar: default 5
  const paginationSizes = numPages >= 3 ? 3 : numPages;
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
  return res.render("users/index", {
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
  req.body.avatar = req.file.path.split('/').slice(1).join('/');
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