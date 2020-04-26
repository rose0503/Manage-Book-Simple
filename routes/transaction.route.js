var express = require('express')
var router = express.Router()
const db =require("../db.js");
const shortid = require('shortid');

router.get("/", (req, res) => {
  res.render('transactions/index',{
    transactions: db.get('transactions').value()
  })
});



module.exports = router;