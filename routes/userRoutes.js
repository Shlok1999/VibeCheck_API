const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');

// jwt

    

// Create a new user

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    let user = { username, email, password };

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Create a new user
        connection.query('INSERT INTO users SET ?', user, (err, result) => {
            if (err) {
                throw err;
            }
            res.status(201).send('User registered');
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error registering user');
    }
});

// Login a user


module.exports = router;