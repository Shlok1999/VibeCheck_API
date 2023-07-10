const connection = require('../db/conn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const session = require('express-session');

const userController = {
    // Create a new user
    register: async (req, res) => {
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
                res.status(201).send({message: 'User created', result: result});
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({message: 'Error creating user', error: error});
        }
    },

    // Login a user
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Check if user exists
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
                if (err) {
                    throw err;
                }
                if (result.length === 0) {
                    return res.status(400).send('User does not exist');
                }

                // Check if password is correct
                const validPassword = await bcrypt.compare(password, result[0].password);
                if (!validPassword) {
                    return res.status(400).send('Password is incorrect');
                }

                // Create and assign a token
                const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET_KEY);
                res.header('auth-token', token).send({message: 'User logged in', token: token, result: result});
            });
        } catch (error) {
            console.log(error);
            res.status(500).send('Error logging in user');
        }
    },
    viewProfile: async (req, res) => {
        try {
            const bearerToken = req.headers['authorization'];
            const token = bearerToken? bearerToken.split(' ')[1] : null;
            if(!token) {
                return res.status(401).send({message: "No token provided"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded.id;
            connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).send({message: 'User profile retrieved', result: result});
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Error retrieving user profile');
        }
    },

    updateProfile: async (req, res) => {
        try {
            const bearerToken = req.headers['authorization'];
            const token = bearerToken? bearerToken.split(' ')[1] : null;
            if(!token) {
                return res.status(401).send({message: "No token provided"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded.id;
            connection.query('UPDATE users SET ? WHERE id = ?', [req.body, userId], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(200).send({message: 'User profile updated', result: result});
            });

        } catch (error) {
            console.log(error);
            res.status(500).send('Error updating user profile');
        }
    },
};

module.exports = userController;
