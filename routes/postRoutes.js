const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');

const postController = require('../controllers/postController');

router.get('/', postController.viewPosts);
router.post('/add', postController.addPosts);

module.exports = router;