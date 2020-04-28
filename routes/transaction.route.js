var express = require('express')
var router = express.Router()

const controller = require("../controllers/transaction.controller")

router.get("/", controller.index);


router.get("/create", controller.create);

router.get('/:id/complete', (req, res) => {
  var id = req.params.id;
  var trans = db.get('transactions').value();
  if(!trans.isComplete)
    db.get('transactions').find({ id: id}).assign({ isComplete: true}).write();
  res.redirect('/transactions');
});

router.post('/create', (req, res) => {
  req.body.id = shortid.generate();
  
  req.body.isComplete = false;
  db.get('transactions').push(req.body).write();
  res.redirect('/transactions');
});


module.exports = router; 