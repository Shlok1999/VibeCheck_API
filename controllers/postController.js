const connection = require('../db/conn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const session = require('express-session');

const postController = {
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
        try {
          // Check if user is logged in
          const bearerToken = req.headers['authorization'];
          const token = bearerToken ? bearerToken.split(' ')[1] : null;
          if (!token) {
            return res.status(401).send({ message: 'No token provided' });
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          const userId = decoded.id;
          console.log(userId);
      
          const { caption, media_url } = req.body;
      
          // Create new post
          if (userId) {
            connection.query(
              'INSERT INTO posts (user_id, caption, media_url) VALUES (?, ?, ?)',
              [userId, caption, media_url],
              (err, result) => {
                if (err) {
                  console.error(err);
                  return res.status(500).send({ message: 'Error creating post', error: err });
                }
                res.status(200).send({ message: 'Post created successfully', result: result });
              }
            );
          } else {
            res.status(401).send({ message: 'User not logged in' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: 'Error creating post', error: error });
        }
      },
      viewFriendPost: async (req, res) => {
        try {
          // Check if user is logged in
          const bearerToken = req.headers['authorization'];
          const token = bearerToken ? bearerToken.split(' ')[1] : null;
          if (!token) {
            return res.status(401).send({ message: 'No token provided' });
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          const userId = decoded.id;
      
          const { friendId } = req.params;
      
          // Get all posts
            if (userId) {
                connection.query(`SELECT * from posts WHERE user_id = ?`, [friendId], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send({message: 'Posts retrieved', result: result});
                }
                );
            }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: 'Error retrieving posts', error: error });
        }
      },
      
      viewFriendProfile: async (req, res) => {
        try {
          // Check if user is logged in
          const bearerToken = req.headers['authorization'];
          const token = bearerToken ? bearerToken.split(' ')[1] : null;
          if (!token) {
            return res.status(401).send({ message: 'No token provided' });
          }
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
          const userId = decoded.id;
      
          const { friendId } = req.params;
      
          // Get all posts
            if (userId) {
                connection.query(`SELECT * from users WHERE id = ?`, [friendId], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send({message: 'User profile retrieved', result: result});
                }
                );
            }
        } catch (error) {
          console.log(error);
          res.status(500).send({ message: 'Error retrieving posts', error: error });
        }
      }
};

module.exports = postController;