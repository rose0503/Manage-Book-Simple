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
  const users = db.get("users").value();
  const books = db.get("books").value();
  let transactions = db.get("transactions").value();
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
    transactions = transactions.slice(skip, skip + limit);
    const links = generatePagination(page, paginationSizes, numPages);
    pagination = {
      links,
      numPages,
      page,
      limit,
      start: skip
    };
  }
  //res.render("transaction/index", { transactions, auth: req.user, pagination });
  res.render('transactions/index',{
    transactions: transactions,
    users: users,
    books: books,
    pagination
  }) 
  console.log(db.get('transactions').value())
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
