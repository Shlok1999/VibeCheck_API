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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                throw err;
            }
            if (!result.length) {
                return res.status(400).send('User does not exist');
            }

            // Check if password is correct
            const isMatch = await bcrypt.compare(password, result[0].password);
            if (!isMatch) {
                return res.status(400).send('Incorrect password');
            }

            // Create and assign a token
            const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token, user: result[0] });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error logging in user');
    }
});


module.exports = router;