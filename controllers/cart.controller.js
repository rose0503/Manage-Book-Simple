const db =require("../db.js");

module.exports.addToCart = (req, res) =>{
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  var session=  db.get('sessions').find({id: sessionId}).value()
  if(!sessionId){
    res.redirect('/books')
    return;
  }
  var count = db.get('sessions').find({id: sessionId}).get('cart.' + id, 0).value();
  console.log("count",count);
  db.get('sessions').find({id: sessionId}).set("cart." + id, count + 1).write();
  const cartArr = session.cart;
  console.log("cartid", session.cart)
  for(let a of cartArr)
    console.log(a)
  let result = cartArr.reduce((acc, cur) => {
        return (acc += cur);
      }, 0);
  res.locals.countBooks = result;
  
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