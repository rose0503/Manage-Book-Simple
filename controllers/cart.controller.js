const db =require("../db.js");

const shortid = require('shortid');

var Session = require("../models/session.model");
var Book = require("../models/book.model");
var Transaction = require("../models/transaction.model");

module.exports.addToCart = async (req, res) =>{
  var bookId = req.params.id;
  var sessionId = req.signedCookies.sessionId;
  // var session=  db.get('sessions').find({id: sessionId}).value()
  
  //const session = await Session.findOne({id : sessionId}) 
  if(!sessionId){
    res.redirect('/books')
    return;
  }
  // //var count = db.get('sessions').find({id: sessionId}).get('cart.' + bookId, 0).value();
  // var count = await Session.findOne({id : sessionId}).get('cart.' + bookId, 0)
  // console.log("count",count);
  // await Session.findOne({id : sessionId}).set("cart." + bookId, count + 1);
  // // const cartArr = session.cart;
  // // //console.log("cartid", session.cart)
  // // let result = 0;
  // // for(let a of Object.keys(cartArr))
  // //   result += cartArr[a];
  // // res.locals.countBooks = result;
  // //console.log(result)
  
  Session.findOne({ id: sessionId }, async function(err, doc) {
        if (err) {
          console.log(err);
        }
        if (!doc) {
          let newSes = new Session();
          newSes.id = sessionId;
          newSes.cart = [{ bookId: bookId, count: 1 }];
          //console.log("newSec" ,newSes)
          await newSes.save();
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
        }
  });
  res.redirect('/books');
  
};

module.exports.index = async (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  
  // const cart = db
  //   .get("sessions")
  //   .find({ id: sessionId })
  //   .value();
  
  const cart = await Session.findOne({id : sessionId}) 
  //console.log("cart", cart)
  //const bookId = cart ? cart.cart : [];
  //console.log("booid",bookId)
  //const books = db.get("books").value();

  const books = await Book.find({});
  res.render("cart/cart", { cart, books });
};

module.exports.postCart=  async (req, res) => {
  const { sessionId } = req.signedCookies;
  const userId = req.signedCookies.userId;

  const cartData = await Session.findOne({id : sessionId}) 
  var bookIds = cartData.cart.map(x => x.bookId)
  
  const books = await Book.find({});  
  let notifi= [];
  
  try {
    if (!cartData) 
      notifi.push("Bạn phải đăng nhập để thuê sách!!");
    
    if (!userId) 
      notifi.push("Bạn phải đăng nhập để thuê sách!!");    
    
   
    if(notifi.length){
      res.render('cart/cart',{
        notifi: notifi,
        cart: cartData,
        books: books,
        
      })
      return;
    }
    
    const newTransaction = new Transaction({
      userId: userId,
      bookId: bookIds 
    });

    await newTransaction.save();
    await Session.findByIdAndRemove({id: sessionId});   
    
    res.clearCookie("sessionId");
    res.redirect("/books")
  } catch (error) {
    res.render("cart/cart", { message: error.message });
  }
}