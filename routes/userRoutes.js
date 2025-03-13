// Import the Express framework

const express = require('express');

// Import the register and login controller functions from userController.js

const { register, login } = require('../controllers/userController');

// Create a new router instance

const router = express.Router();
 

 
router.post('/login', login);
router.post('/register', register);

// Export the router so it can be used in other parts of the application

module.exports = router;
