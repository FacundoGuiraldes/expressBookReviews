const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const libro = books[isbn];

  if (libro) {
    return res.status(200).json(libro);
  } else {
    return res.status(404).json({ message: 'Libro no encontrado' });
  }
});
  
public_users.get('/author/:author', function (req, res) {
  const autor = req.params.author;
  const resultado = {};

  Object.keys(books).forEach(function(isbn) {
    if (books[isbn].author === autor) {
      resultado[isbn] = books[isbn];
    }
  });

  if (Object.keys(resultado).length === 0) {
    return res.status(404).json({ message: 'No se encontraron libros de ese autor' });
  } else {
    return res.status(200).json(resultado);scrollBy
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const resultado = {};

  Object.keys(books).forEach(function(isbn) {
    if (books[isbn].title === title) {
      resultado[isbn] = books[isbn];
    }
  });

  if (Object.keys(resultado).length === 0) {
    return res.status(404).json({ message: 'No se encontraron libros con ese título' });
  } else {
    return res.status(200).json(resultado);
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const libro = books[isbn];

  if (libro) {
    return res.status(200).json(libro.reviews);
  } else {
    return res.status(404).json({ message: 'Libro no encontrado' });
  }
});

module.exports.general = public_users;
