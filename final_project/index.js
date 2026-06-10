const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books = require('./router/booksdb.js');

const app = express();
const internal = express();

app.use(express.json());
internal.use(express.json());

// Servidor interno en puerto 5001 para datos
internal.get('/', (req, res) => res.json(books));
internal.get('/isbn/:isbn', (req, res) => {
  const libro = books[req.params.isbn];
  libro ? res.json(libro) : res.status(404).json({ message: 'Book not found' });
});
internal.get('/author/:author', (req, res) => {
  const resultado = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === req.params.author) resultado[isbn] = books[isbn];
  });
  Object.keys(resultado).length > 0 ? res.json(resultado) : res.status(404).json({ message: 'No books found' });
});
internal.get('/title/:title', (req, res) => {
  const resultado = {};
  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === req.params.title) resultado[isbn] = books[isbn];
  });
  Object.keys(resultado).length > 0 ? res.json(resultado) : res.status(404).json({ message: 'No books found' });
});
internal.listen(5001, () => console.log("Internal server running on 5001"));

app.use("/customer", session({secret:"fingerprint_customer", resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next){
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
      req.user = user;
      next();
    });
  } else if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (err) return res.status(403).json({ message: 'Token inválido' });
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'Por favor iniciá sesión' });
  }
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.listen(PORT, () => console.log("Server is running"));