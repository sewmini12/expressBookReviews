const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user. Provide username and password." });
});

// Get the book list available in the shop
// Task 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
  try {
    // Simulating an asynchronous operation to get books
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    
    const bookList = await getBooks;
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});


// Get book details based on ISBN
// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Simulating an asynchronous database call
    const getBook = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject("Book not found");
      }
    });

    const bookDetails = await getBook;
    res.status(200).send(JSON.stringify(bookDetails, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

  
// Get book details based on author
// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const bookKeys = Object.keys(books);
      const filteredBooks = [];

      bookKeys.forEach(key => {
        if (books[key].author === author) {
          filteredBooks.push({ "isbn": key, ...books[key] });
        }
      });

      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found by this author");
      }
    });

    const bookList = await getBooksByAuthor;
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const filteredBooks = [];

  // Iterate through the books object to find matches for the title
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      filteredBooks.push({ "isbn": key, ...books[key] });
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    // Return only the reviews of the book
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
