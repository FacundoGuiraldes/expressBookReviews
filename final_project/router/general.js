const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'User already exists' });
  }
  users.push({ username, password });
  return res.status(200).json({ message: 'User successfully registered. Now you can login' });
});

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5001/');
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(500).json({ message: 'Error fetching books' });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5001/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const autor = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5001/author/${encodeURIComponent(autor)}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(404).json({ message: 'No books found for this author' });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5001/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch(error) {
    return res.status(404).json({ message: 'No books found for this title' });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const libro = books[isbn];
  if (libro) {
    return res.status(200).json(libro.reviews);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;