const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js'); // booksdb.js dosyasını buraya import ediyoruz
const regd_users = express.Router();

let users = [];

const isValidUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    const validUser = isValidUser(username, password);
    if (!validUser) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User logged in successfully", token: accessToken });
});

// Task 8: Add/Modify book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; // Review'ü JSON body'den alıyoruz
    const username = req.user.username;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
});

// Task 9: Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    const book = books[isbn];
    if (!book || !book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
