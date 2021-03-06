const bcrypt = require("bcrypt");
const saltRounds = 10;

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
}

module.exports.index = async (req, res) => {
  const query = await User.find({});
  //console.log("query", query);
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
  res.render("users/create");
};

module.exports.postCreate = async (req, res) => {
  var avatar = req.file.path
    .split("/")
    .slice(1)
    .join("/");
  await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      name: req.body.name,
      password: hash,
      email: req.body.email,
      age: req.body.age,
      avatar
    });
    //console.log("new user", newUser)
    newUser.save();
  });

  res.redirect("/users");
};

module.exports.getId = async (req, res) => {
  var id = req.params.id;
  var user = await User.findOne({ _id: id });
  res.render("users/view", {
    user: user
  });
};

module.exports.edit = async (req, res) => {
  var id = req.params.id;
  var user = await User.findOne({ _id: id });
  res.render("users/edit", {
    user: user
  });
};

module.exports.delete = async (req, res) => {
  var id = req.params.id;
  await User.findByIdAndRemove({ _id: id });
  res.redirect("/users");
};

module.exports.postEdit = async (req, res) => {
  var id = req.params.id;
  await User.findByIdAndUpdate(
    { _id: id },
    { name: req.body.name, age: req.body.age }
  );
  res.redirect("/users");
};
