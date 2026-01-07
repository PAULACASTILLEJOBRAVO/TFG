// Import modulers
const express = require('express');
const router = express.Router();

// Import controller
const authenticationController = require('../../controllers/v1/authenticationController');

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Route to login an user
router.post('/login', authenticationController.loginUser);

// Route to register an user
router.post('/register', authenticationController.registerUser);

router.post('/logout', authenticate, authenticationController.logoutUser);

//Export the module
module.exports = router;