var User = require("../../models/user.model");
var Book = require("../../models/book.model");
var Session = require("../../models/session.model");
var Transaction = require("../../models/transaction.model");

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
  const users = await User.find({});
  const books = await Book.find({});
  const transactions = await Transaction.find({});

  var transaction = [];

  let { page, limit } = req.query;
  page = +page && +page >= 0 ? +page : 0;
  limit = +limit && +limit >= 0 ? +limit : 4;
  let pagination = null;

  if (transactions.length > 0) {
    // pagination
    const length = transactions.length;
    // num of pages
    const numPages = Math.ceil(length / limit);

    // size of a pagination bar: default 5
    const paginationSizes = numPages >= 4 ? 4 : numPages;
    if (page >= numPages) {
      page = numPages - 1;
    }
    // skip
    const skip = page * limit;

    transaction = transactions.slice(skip, skip + limit);
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }
  res.status(200).json({
    transactions: transaction,
    users: users,
    books: books,
    pagination
  });
};

module.exports.complete = async (req, res) => {
  var id = req.params.id;
  const trans = await Transaction.find({});
  var error = [];

  // if(trans.id != id)
  //   error.push('Yêu cầu không hợp lệ.')
  // if(error.length){
  //   res.render('transactions/complete',{
  //     errors: error
  //   })
  //   return;
  // }
  if (!trans.isComplete)
    await Transaction.findByIdAndUpdate({ _id: id }, { isComplete: true });
  return res.status(200).json({
    transaction: trans
  });
};

module.exports.postCreate = async (req, res) => {
  //console.log("result req.body", req.body)
  const newTransaction = new Transaction({
    bookId: req.body.bookId,
    userId: req.body.userId
  });
  //console.log("newTransaction", newTransaction)
  await newTransaction.save();
  return res.status(200).json({
    transaction: newTransaction
  });
  
};
