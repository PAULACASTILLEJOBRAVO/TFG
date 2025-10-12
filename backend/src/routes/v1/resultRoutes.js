// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const resultController = require('../../controllers/v1/resultControllers');

// Result routes
// Route to get all results
router.get('/', resultController.getAllResults);

// Export the module
module.exports = router;