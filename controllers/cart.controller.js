const db =require("../db.js");

module.exports.addToCart = (req, res) =>{
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  
  if(!sessionId){
    res.redirect('/books')
    return;
  }
  var count = db.get('sessions', 'cart[0].count').find({id: sessionId}).value();
  console.log("count", count)
  db.get('sessions').find({id: sessionId}).set("cart.bookId" + id, count + 1).write();
  res.redirect('/books');
  
};

module.exports.index = (req, res) => {
  const { sessionId } = req.signedCookies;
  
  const cart = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  
  const bookId = cart ? cart.cart : {};
  const books = db.get("books").value();

  res.render("cart/cart", { cart, books });
};