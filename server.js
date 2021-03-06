// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require("dotenv").config();
const express = require("express");
const app = express();
const pug = require("pug");
var cors = require('cors');
const port = process.env.PORT || 8080;
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var csurf = require("csurf");
const expressValidator = require('express-validator')
var mongoose = require("mongoose");

app.use(cors())

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    dbName: "CRUD-Book"
  })
  .then(_ => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB can't connect", err));

var indexRoute = require("./routes/index.route.js");
var authRoute = require("./routes/auth.route.js");
var bookRoute = require("./routes/book.route.js");
var userRoute = require("./routes/user.route.js");
var transactionRoute = require("./routes/transaction.route.js");
var profileRoute = require("./routes/profile.route.js");
var cartRoute = require("./routes/cart.route.js");
var shopRoute = require("./routes/shop.route.js");


var authMiddleware = require("./middlewares/auth.middleware");
var accountMiddleware = require("./middlewares/account.middleware");
var sessionMiddleware = require("./middlewares/session.middleware");
const cartMiddleWare = require("./middlewares/cart.middleware");

//error
const errorHandler = require("./middlewares/error");

//api
const authApiRoutes = require("./api/routes/auth.route");
const transactionsApiRoutes = require("./api/routes/transaction.route");
const bookApiRoutes = require("./api/routes/book.route");
const usersApiRoutes = require("./api/routes/user.route");
const profileApiRoutes = require("./api/routes/profile.route");
const cartApiRouters = require('./api/routes/cart.route')
const shopApiRouters = require('./api/routes/shop.route')

app.set("views", "./views");
app.set("view engine", "pug");
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(expressValidator())
//app.use(csurf({cookie:true}))
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
app.use(express.static("public"));
app.use(errorHandler);
app.use(accountMiddleware.isAdmin);
app.use(sessionMiddleware.session);
app.use(cartMiddleWare.cart);

// api
app.use("/api/auth", authApiRoutes);
app.use("/api/trans", transactionsApiRoutes);
app.use("/api/books", bookApiRoutes);
app.use("/api/users", usersApiRoutes);
app.use("/api/profile", profileApiRoutes);
app.use("/api/cart", cartApiRouters);
app.use("/api/shop", shopApiRouters);

app.use("/auth", authRoute);

app.get("/", authMiddleware.requireAuth, accountMiddleware.isAdmin, indexRoute);
app.use(
  "/books",
  accountMiddleware.isUser,
  accountMiddleware.isAdmin,
  bookRoute
);
app.use(
  "/profiles",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  profileRoute
);
app.use(
  "/users",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  userRoute
);
app.use(
  "/transactions",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  transactionRoute
);

app.use(
  "/shops",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  shopRoute
);

app.use("/cart", accountMiddleware.isAdmin, cartRoute);

app.get("/*", (req, res) => res.render("./error/500.pug"));
// listen for requests :)
const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
