const db =require("../db.js");

const shortid = require('shortid');

module.exports.addToCart = (req, res) =>{
  var bookId = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  var session=  db.get('sessions').find({id: sessionId}).value()
  if(!sessionId){
    res.redirect('/books')
    return;
  }
  var count = db.get('sessions').find({id: sessionId}).get('cart.' + bookId, 0).value();
  console.log("count",count);
  db.get('sessions').find({id: sessionId}).set("cart." + bookId, count + 1).write();
  const cartArr = session.cart;
  //console.log("cartid", session.cart)
  let result = 0;
  for(let a of Object.keys(cartArr))
    result += cartArr[a];
  res.locals.countBooks = result;
  //console.log(result)
  res.redirect('/books');
  
};

module.exports.index = (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  
  const cart = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  console.log("cart", cart)
  //const bookId = cart ? cart.cart : [];
  //console.log("booid",bookId)
  const books = db.get("books").value();

  res.render("cart/cart", { cart, books });
};

module.exports.postCart=  async (req, res) => {
  const { sessionId } = req.signedCookies;
  //const { user } = req;
  const userId = req.signedCookies.userId;
  const cartData = db
    .get("sessions")
    .find({ id: sessionId })
    .value();
  
  //const bookId = cartData ? cartData.cart : [];

  const booksData = db.get("books").value();
  let notifi= [];
  let su;
  try {
    if (!cartData) 
      notifi.push("Bạn phải đăng nhập để thuê sách!!");
    
      if (!userId) 
      notifi.push("Bạn phải đăng nhập để thuê sách!!");
      
    // const cart = db
    //   .get("sessions")
    //   .find({ id: sessionId })
    //   .value();
    // if (!cart) throw new Exception("Invalid Request");
    else{
      const newTransaction = {
        userId: userId,
        bookId:Object.keys(cartData.cart) ,
        id: shortid.generate(),
        isComplete: false
      };
      db.get("transactions")
      .push(newTransaction)
      .write();
      res.clearCookie("sessionId");
      db.get("sessions")
        .remove({ id: sessionId })
        .write();
        
      su= "Bạn đã thuê sách thành công!!";
    }
   
    if(notifi.length){
      res.render('cart/cart',{
        notifi: notifi,
        cart: cartData,
        books: booksData,
        success : su
      })
      return;

    }
  } catch (error) {
    res.render("cart/cart", { message: error.message });
  }
}