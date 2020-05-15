const db =require("../db.js");
const shortid = require('shortid');

var User = require("../models/user.model");
var Book = require("../models/book.model");
var Session = require("../models/session.model");
var Transaction = require("../models/transaction.model");


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

// module.exports.index = async (req, res) => {
//   // const users = db.get("users").value();
//   const users = await User.find({});
//   // const books = db.get("books").value();
//   const books = await Book .find({});
//   // let transactions = db.get("transactions").value();
//   const transactions = await Transaction.find({})
//   let { page, limit } = req.query;
//   page = +page && +page >= 0 ? +page : 0;
//   limit = +limit && +limit >= 0 ? +limit : 4;
//   let pagination = null;

//   if (transactions.length > 0) {    

//     // pagination
//     const length = transactions.length;
//     // num of pages
//     const numPages = Math.ceil(length / limit);

//     // size of a pagination bar: default 5
//     const paginationSizes = numPages >= 4 ? 4 : numPages;
//     if (page >= numPages) {
//       page = numPages - 1;
//     }
//     // skip
//     const skip = page * limit;
//     //transactions = transactions.slice(skip, skip + limit);
//     transactions = await Transaction.find({}, null, { limit, skip });
//     const links = generatePagination(page, paginationSizes, numPages);
//     pagination = {
//       links,
//       numPages,
//       page,
//       limit,
//       start: skip
//     };
//   }
//   //res.render("transaction/index", { transactions, auth: req.user, pagination });
//   res.render('transactions/index',{
//     transactions: transactions,
//     users: users,
//     books: books,
//     pagination
//   }) 
//   //console.log(db.get('transactions').value())
// };


module.exports.index = async (req, res) => {
  let { page, limit } = req.query;
  page = +page && +page >= 0 ? Math.abs(+page) : 0;
  limit = +limit && +limit >= 0 ? Math.abs(+limit) : 3;
  let pagination = null;
  const length = await Transaction.estimatedDocumentCount();
  let transactions = [];
  if (length > 0) {
    // num of pages
    const numPages = Math.ceil(length / limit);

    // size of a pagination bar: default 5
    const paginationSizes = numPages >= 5 ? 5 : numPages;
    if (page >= numPages && numPages > 0) {
      page = numPages - 1;
    }

    // skip
    const skip = page * limit;
    transactions = await Transaction.find({}, null, { limit, skip });
    let { userIds, bookIds } = transactions.reduce(
      (acc, curr) => {
        acc.userIds
          .add(curr.userId);
        curr.bookIds.forEach(bookId => {
          acc.bookIds.add(bookId);
        });
        return acc;
      },
      { userIds: new Set(), bookIds: new Set() }
    );
    userIds = Array.from(userIds.values());
    bookIds = Array.from(bookIds.values());
    const [users, books] = await Promise.all([
      User.find({ _id: { $in: userIds } }),
      Book.find({ _id: { $in: bookIds } })
    ]);
    if (req.user.isAdmin !== false) {
      transactions = transactions.filter(trans => {
        const { userId, isCompleted } = trans;
        const user = users.find(val => val._id.toString() === userId);
        if (
          isCompleted === true ||
          !user ||
          user.isLogging === false ||
          user.role === 0
        )
          return false;
        return true;
      });
    }
    transactions = transactions.map(trans => {
      const { bookIds, userId, _id, isCompleted } = trans;
      const user = users.find(val => {
        console.log(typeof val._id.str);
        return val._id.toString() === userId;
      });
      const rentedBooks = books.filter(val => bookIds.includes(val._id));
      return { _id, user, books: rentedBooks, isCompleted };
    });
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }
  res.render("transaction/index", { transactions, auth: req.user, pagination });
};


module.exports.create = (req, res) => {
  res.render('transactions/create.pug', {
    users: db.get("users").value(),
    books: db.get("books").value(),
  })
};

module.exports.complete = (req, res) => {
  var id = req.params.id;
  var trans = db.get('transactions').value();
  var error =[];
  
  // if(trans.id != id)
  //   error.push('Yêu cầu không hợp lệ.')
  // if(error.length){
  //   res.render('transactions/complete',{
  //     errors: error 
  //   })
  //   return;
  // }
  if(!trans.isComplete)
    db.get('transactions').find({ id: id}).assign({ isComplete: true}).write();
  res.redirect('/transactions');
  
};


module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();  
  req.body.isComplete = false;
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
};
