const db =require("../db.js");

module.exports.addToCart = (req, res) =>{
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  
  if(!sessionId){
    res.redirect('/books')
    return;
  }
  var count = db.get('sessions').find({id: sessionId}).get('cart.' + id, 0).value();
  
  db.get('sessions').find({id: sessionId}).set("cart." + id, count + 1).write();
  res.redirect('/books');
  
};