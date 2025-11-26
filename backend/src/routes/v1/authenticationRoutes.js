// Import modulers
const express = require('express');
const router = express.Router();
const authenticationController = require('../../controllers/v1/authenticationController');

// Route to login a user
router.post('/login', authenticationController.loginUser);

//Export the module
module.exports = router;