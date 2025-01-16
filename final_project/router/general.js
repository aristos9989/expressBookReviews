const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if ((username.length === 0) & (password.length === 0)) {
        return res.status(203).json({ message: "Username and password cannot be empty." });
    }
    else if (username.length === 0) {
        return res.status(203).json({ message: "Username cannot be empty." });
    }
    else if (password.length === 0) {
        return res.status(203).json({ message: "Password cannot be empty." });
    } else {
        users.forEach((user) => {
            if (user["username"] === username) {
                return res.status(208).json({ message: "User already exists. You can try logging in instead." })
            }
        });
        users.push({
            "username": username,
            "password": password
        });
        return res.status(200).json({ message: "User registered successfully." })
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books);
    })
        .then(data => {
            return res.send(JSON.stringify(data, null, 4));
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            return res.status(500).json({ message: "Error fetching books" })
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    new Promise((resolve, reject) => {
        const book = books[req.params.isbn]
        resolve(book);
    })
        .then(data => {
            return res.send(JSON.stringify(data, null, 4));
        })
        .catch(error => {
            console.error('Error fetching book:', error);
            return res.status(500).json({ message: "Error fetching book" })
        });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    new Promise((resolve, reject) => {
        const author = req.params.author;
        let booksToShow = {};
        for (const [key, value] of Object.entries(books)) {
            if (books[key]["author"] === author) {
                booksToShow[key] = value;
            }
        };
        resolve(booksToShow);
    })
        .then(data => {
            return res.send(JSON.stringify(data, null, 4));
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            return res.status(500).json({ message: "Error fetching books" })
        });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    new Promise((resolve, reject) => {
        const title = req.params.title;
        let booksToShow = {};
        for (const [key, value] of Object.entries(books)) {
            if (books[key]["title"] === title) {
                booksToShow[key] = value;
            }
        };
        resolve(booksToShow);
    })
        .then(data => {
            return res.send(JSON.stringify(data, null, 4));
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            return res.status(500).json({ message: "Error fetching books" })
        });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn
    return res.send(books[isbn]["reviews"], null, 4);
});

module.exports.general = public_users;
