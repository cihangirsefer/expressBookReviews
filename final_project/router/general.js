const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 1 & Task 10: Get all books (Async/Await)
public_users.get('/', async (req, res) => {
    try {
        const booksList = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 100); // 100 ms'lik bir gecikme simüle ediyoruz
        });
        return res.status(200).json(booksList);
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books list" });
    }
});

// Task 2 & Task 11: Get book details by ISBN (Async/Await)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books[isbn]);
            }, 100);
        });

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving book details" });
    }
});

// Task 3 & Task 12: Get book details by author (Async/Await)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.trim().toLowerCase();
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = Object.values(books).filter(book => book.author.toLowerCase() === author);
                resolve(result);
            }, 100);
        });

        if (booksByAuthor.length > 0) {
            return res.status(200).json(booksByAuthor);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books by author" });
    }
});

// Task 4 & Task 13: Get book details by title (Async/Await)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.trim().toLowerCase();
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const result = Object.values(books).filter(book => book.title.toLowerCase() === title);
                resolve(result);
            }, 100);
        });

        if (booksByTitle.length > 0) {
            return res.status(200).json(booksByTitle);
        } else {
            return res.status(404).json({ message: "No books found with this title" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books by title" });
    }
});

// Task 5: Get book review by ISBN
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
