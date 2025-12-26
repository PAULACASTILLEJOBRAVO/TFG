// Import modulers
const express = require('express');
const router = express.Router();
const authenticationController = require('../../controllers/v1/authenticationController');

// Route to login an user
router.post('/login', authenticationController.loginUser);

// Route to register an user
router.post('/register', authenticationController.registerUser);

//Export the module
module.exports = router;