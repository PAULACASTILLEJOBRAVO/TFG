// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const sessionController = require('../../controllers/v1/sessionControllers');

// Session routes
// Route to get all sessions
router.get('/', sessionController.getAllSessions);

// Export the module
module.exports = router;