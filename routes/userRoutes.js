const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const connection = require('../db/conn');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.viewProfile);
router.patch('/update-profile', userController.updateProfile);

module.exports = router;