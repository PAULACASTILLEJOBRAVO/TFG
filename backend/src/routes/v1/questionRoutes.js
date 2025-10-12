// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const questionController = require('../../controllers/v1/questionControllers');

// Question routes
// Route to get all questions
router.get('/', questionController.getAllQuestions);

// Export the module
module.exports = router;