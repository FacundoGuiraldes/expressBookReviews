const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
let users = [];

const isValid = (username) => {
  return users.some(u => u.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });
  req.session.authorization = { accessToken: token, username };
  return res.status(200).json({ message: 'Login exitoso', token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Libro no encontrado' });
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ 
    message: 'Reseña agregada exitosamente',
    reviews: books[isbn].reviews 
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Libro no encontrado' });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: 'No tenés ninguna reseña para este libro' });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ 
    message: 'Reseña eliminada exitosamente',
    reviews: books[isbn].reviews 
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;