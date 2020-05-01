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
  var transactions = db.get('transactions').value();
  var users = db.get('users').value();
  var books = db.get('books').value();
  res.render('transactions/index',{
    transactions: transactions,
    users: users,
    books: books
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
