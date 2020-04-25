// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.set('views', './views');
app.set('view engine', 'pug');


// Set some defaults (required if your JSON file is empty)
db.defaults({ books: []})
  .write()

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

app.post('/books/create', (req, res) => {
  //req.body.id = shortid.generate();
  //console.log(req.body.id)
  db.get('books').push(req.body).write();
  res.redirect('/books');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
