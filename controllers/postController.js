const connection = require('../db/conn');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
require('dotenv').config();
const session = require('express-session');


//Setting the storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

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
    
        const { caption } = req.body;
    
        // Handle file upload using multer
        upload.single('media_url')(req, res, (err) => {
          if (err instanceof multer.MulterError) {
            // A multer error occurred during file upload
            console.error('Multer error:', err);
            return res.status(400).send({ message: 'File upload error', error: err });
          } else if (err) {
            // An unknown error occurred during file upload
            console.error('Unknown error:', err);
            return res.status(500).send({ message: 'Error creating post', error: err });
          }
    
          // File upload successful
          const media_url = req.file ? +req.file.filename : null;
    
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
        });
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