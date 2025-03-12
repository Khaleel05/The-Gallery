//routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Check login details
router.post('/', userController.checkLogin);

// Register a new user
router.post('/register', userController.registerUser);

//Register a new user 
router.get('/logout', userController.logout);

//Get current user profile
router.get('/profile', userController.getUserProfile);

module.exports = router;