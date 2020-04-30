// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const pug = require("pug");
var cookieParser = require("cookie-parser");

var indexRoute = require("./routes/index.route.js");
var authRoute = require("./routes/auth.route.js");
var bookRoute = require("./routes/book.route.js");
var userRoute = require("./routes/user.route.js");
var transactionRoute = require("./routes/transaction.route.js");

var authMiddleware = require("./middlewares/auth.middleware");
var accountMiddleware = require("./middlewares/account.middleware");

app.set("views", "./views");
app.set("view engine", "pug");
app.use(cookieParser());

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get(
  "/",
  authMiddleware.requireAuth,
  accountMiddleware.isUser,
  accountMiddleware.isAdmin,
  indexRoute
);
app.use(
  "/books",
  authMiddleware.requireAuth,
  accountMiddleware.isUser,
  accountMiddleware.isAdmin,
  bookRoute
);
app.use(
  "/users",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  accountMiddleware.isUser,
  userRoute
);
app.use(
  "/transactions",
  authMiddleware.requireAuth,
  accountMiddleware.isAdmin,
  accountMiddleware.isUser,
  transactionRoute
);
app.use("/auth", authRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
