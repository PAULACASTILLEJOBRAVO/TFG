//Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const quizController = require('../../controllers/v1/quizControllers');

// Course routes
// Route to get all quizzes
router.get('/', quizController.getAllQuizzes);

// Export the module
module.exports = router;