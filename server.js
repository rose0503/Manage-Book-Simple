// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const pug = require("pug");
const shortid = require('shortid');

const db =require("./db.hs")

app.set('views', './views');
app.set('view engine', 'pug');



app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/books", (req, res) => {
  res.render('books/index',{
    books: db.get('books').value()
  })
});

app.get("/books/create", (req, res) => {
  res.render('books/create')});

app.get("/books/:id", (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/view',{
    book: book
  })
});

app.get("/books/:id/edit", (req, res) => {
  var id = req.params.id;
  var book = db.get('books').find({ id: id}).value();
  res.render('books/edit',{ 
    book: book
  })
});

app.post('/books/:id/edit', (req, res) => {
  var id = req.params.id;
  db.get('books').find({ id: id}).assign({ title: req.body.title}).write();
  res.redirect('/books');
});

app.get('/books/:id/delete', (req, res) => {
  var id = req.params.id;
  db.get('books').remove({ id: id}).write();
  res.redirect('/books');
});

app.post('/books/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

app.get("/books/sreach", (req, res) => {
  var q = req.query.q;
  var matchBooks = db.get("books").value().filter((book) => {
    return book.title.toLowerCase().indexOf(q.toLowerCase()) !== -1 
  })
  res.render('books/view',{
    book: matchBooks,
    q: q
  })
});

app.get("/users", (req, res) => {
  res.render('users/index',{
    users: db.get('users').value()
  })
});

app.get("/users/create", (req, res) => {
  res.render('users/create')});

app.post('/users/create', (req, res) => {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect('/users');
});

app.get("/users/:id", (req, res) => {
  var id = req.params.id;
  var user = db.get('users').find({ id: id}).value();
  res.render('users/view',{
    user: user
  })
});

app.get("/users/:id/edit", (req, res) => {
  var id = req.params.id;
  var user = db.get('users').find({ id: id}).value();
  res.render('users/edit',{ 
    user: user
  })
});

app.get('/users/:id/delete', (req, res) => {
  var id = req.params.id;
  db.get('users').remove({ id: id}).write();
  res.redirect('/users');
});

app.post('/users/:id/edit', (req, res) => {
  var id = req.params.id;
  db.get('users').find({ id: id}).assign({ name: req.body.name, age:req.body.age}).write();
  res.redirect('/users');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
