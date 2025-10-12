// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const responseController = require('../../controllers/v1/responseControllers');

// Response routes
// Route to get all responses
router.get('/', responseController.getAllResponses);

// Export the module
module.exports = router;