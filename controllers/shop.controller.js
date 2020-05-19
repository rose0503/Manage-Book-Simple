const shortid = require("shortid");
var Book = require("../models/book.model");
var Shops = require("../models/shop.model");
var User = require("../models/user.model");

module.exports.index = async (req, res) => {
    const book = await Book.find({});
    res.render("./shops/shop.pug", {
    Books: book
    });
    
  }

  module.exports.createPost=  async (req, res) => {
    const { name, book } = req.body;
    const id = shortid.generate();
    const { userId } = req.signedCookies;
    try {
      const itemBook = book.map(function(x) {
        return { idBook: x, status: true };
      });
      const shop = await new Shops();
      shop.id = id;
      shop.name = name;
      shop.userId = userId;
      shop.status = true;
      shop.listBook = itemBook;
      await shop.save();
      res.redirect(`/shops/customerShop/${userId}`);
    } catch (err) {
      console.log(err);
    }
  }

  module.exports.manageShop= async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({_id: id});
    //console.log("user shop", user);
    const shops = await Shops.findOne({userId: user._id});
    // console.log("shop shop", shops.listBook);
    const book =await Book.find({});
    //console.log("book shop", book)
    res.render("./shops/manageShop.pug", {
        shop: shops,
        Books: book, 
        user: user
      });
    // Shops.find().then(doc => {
    //   Book.find().then(book => {
    //     let listBooks = [];
    //     // find Book by id
    //     const books = doc[0].listBook;
    //     books.map(x => {
    //       const a = book.find(e => e.id === x.idBook);
    //       listBooks.push(a);
    //     });
    //     res.render("./shops/manageShop.pug", {
    //       shop: doc[0],
    //       Books: listBooks,
    //       fullBooks: book
    //     });
    //   });
    // });
  }

  module.exports.addBook =  async (req, res) => {
    const bookdb =await Book.find({});
    const { book } = req.body;
    const { userId } = req.signedCookies;
    const notifi = [];
    const itemBook = [];
    try {
      await Shops.find({ userId: userId }).then(doc => {
        if (!doc) throw new Error("Not Found");
        let bookss = doc[0].listBook;
        if (typeof book === "string") {
          const exist = bookss.find(x => x.idBook === book);
          //console.log("exist", exist);
          if (exist === undefined) {
            //console.log("run here");
            bookss.push({ idBook: book, status: true });
          } else {
            notifi.push("Book existed");
          }
        }

        if (notifi.length > 0) {
          Shops.find().then(doc => {
            Book.find().then(book => {
              let listBooks = [];
              // find Book by id
              const books = doc[0].listBook;
              books.map(x => {
                const a = book.find(e => e.id === x.idBook);
                listBooks.push(a);
              });
              res.render("./shops/manageShop.pug", {
                shop: doc[0],
                Books: bookdb,
                fullBooks: book,
                notifi: notifi
              });
            });
          });
        } else {
          doc[0].listBook = bookss;
          doc[0].save();
          res.redirect(`/shops/manageShop/${user.id}`);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }
  module.exports.customerShop= async (req, res) => {
    const { id } = req.params;
    const user = await User.findOne({_id: id});
    //console.log("user shop", user);
    const shops = await Shops.findOne({userId: user._id});
    // console.log("shop shop", shops.listBook);
    const book =await Book.find({});
    //console.log("book shop", book)
    res.render("./shops/customer.pug", {
        shop: shops,
        Books: book, 
        user: user
      });
    
  }
