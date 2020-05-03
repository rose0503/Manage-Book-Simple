const db =require("../db.js");

module.exports.addToCart = (req, res) =>{
  var id = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  
  var session = db.get('sessions').value()
  // if(!sessionId){
  //   res.redirect('/books')
  //   return;
  // }
  // var count = db.get('sessions').find({id: sessionId}).get('cart.boodId:' + id, 0).value();
  // console.log("count", count);
  // db.get('sessions').find({id: sessionId}).set("cart.bookId:" + id,"count:" +  count + 1).write();
   if(!sessionId){
     let newSes = new session();
         newSes.id = sessionId;
         newSes.cart = [{ bookId: id, count: 1 }];
         newSes.push()
    } else {
      let listCart = doc.cart;
      // found bookId
      let index = listCart.findIndex(x => x.bookId === bookId);
      // not found
      if (index !== -1) {
        listCart[index].count += 1;
      } else {
        listCart.push({ bookId: bookId, count: 1 });
      }
      doc.save();

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