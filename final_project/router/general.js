const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
  }

  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'El usuario ya existe' });
  }

  users.push({ username, password });
  return res.status(200).json({ message: 'Usuario registrado exitosamente' });
});

public_users.get('/', async function (req, res) {
  try {
    const allBooks = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject('No se encontraron libros');
      }
    });
    return res.status(200).json(allBooks);
  } catch(error) {
    return res.status(500).json({ message: error });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const libro = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject('Libro no encontrado');
      }
    });
    return res.status(200).json(libro);
  } catch(error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const autor = req.params.author;
  try {
    const resultado = await new Promise((resolve, reject) => {
      const libros = {};
      Object.keys(books).forEach(function(isbn) {
        if (books[isbn].author === autor) {
          libros[isbn] = books[isbn];
        }
      });
      if (Object.keys(libros).length > 0) {
        resolve(libros);
      } else {
        reject('No se encontraron libros de ese autor');
      }
    });
    return res.status(200).json(resultado);
  } catch(error) {
    return res.status(404).json({ message: error });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const resultado = await new Promise((resolve, reject) => {
      const libros = {};
      Object.keys(books).forEach(function(isbn) {
        if (books[isbn].title === title) {
          libros[isbn] = books[isbn];
        }
      });
      if (Object.keys(libros).length > 0) {
        resolve(libros);
      } else {
        reject('No se encontraron libros con ese título');
      }
    });
    return res.status(200).json(resultado);
  } catch(error) {
    return res.status(404).json({ message: error });
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