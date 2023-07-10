const connection = require('../db/conn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const session = require('express-session');

const userController = {
    // View Posts
    viewPosts: async (req, res) => {
        try {

            // Check if user is logged in
            const bearerToken = req.headers['authorization'];
            const token = bearerToken? bearerToken.split(' ')[1] : null;
            if(!token) {
                return res.status(401).send({message: "No token provided"});
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const userId = decoded.id;

            const users = {caption, media_url} = req.body;

            // Get all posts
            if(userId){
                connection.query(`SELECT * from posts`, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send({message: 'Posts retrieved', result: result});
                });
            }
            else{
                res.status(401).send({message: 'User not logged in'});
            }
            

           
        } catch (error) {
            console.log(error);
            res.status(500).send({message: 'Error retrieving posts', error: error});
        }
    },
    addPosts: async (req, res) => {
        
    }
};

module.exports = userController;