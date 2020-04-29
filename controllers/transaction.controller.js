const db =require("../db.js");
const shortid = require('shortid');

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
