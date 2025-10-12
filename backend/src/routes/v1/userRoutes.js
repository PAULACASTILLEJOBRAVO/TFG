// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../../controllers/v1/userControllers');

// User routes
// Route to get all users
router.get('/', userController.getAllUsers);

//Export the module
module.exports = router;