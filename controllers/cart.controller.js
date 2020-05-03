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

module.exports.index = (req, res) => {
  const { sessionId } = req.signedCookies;

  const cart = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  const cartId = cart ? cart.cart : [];
  const books = db
    .get("books")
    .filter(book => {
      return cartId.includes(book.id);
    })
    .value();

  res.render("cart/index", { auth: req.user, books });
};