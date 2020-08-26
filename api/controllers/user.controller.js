const bcrypt = require("bcrypt");
const saltRounds = 10;

var User = require("../../models/user.model");

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
  return res.status(200).json({
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
    return res.status(200).json({ newUser });
  });

  
};

module.exports.getMyId = (req, res) => {
  var userId = req.user._id;
  User.findOne({ _id: userId})
   .select("-password")
   .then(result => {
      res.status(200).json({ user: user });
   }).catch(error=>{
      return res.status(400).json({error: error})
   })
   
  
};


module.exports.delete = async (req, res) => {
  var id = req.params.id;
  await User.findByIdAndRemove({ _id: id });
  var user = await User.findOne({ _id: id });
  return res.status(200).json({ user: user });
};

module.exports.postEdit = async (req, res) => {
  var id = req.params.id;
  await User.findByIdAndUpdate(
    { _id: id },
    { name: req.body.name, age: req.body.age }
  );
  var user = await User.findOne({ _id: id });
  return res.status(200).json({ user: user });
};
