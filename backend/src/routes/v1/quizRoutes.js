//Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const quizController = require('../../controllers/v1/quizControllers');

// Course routes
/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: quiz management and retrieval
 */

// Route to get all quizzes
/**
 * @swagger
 * /v1/quizzes:
 *   get:
 *      summary: Retrieve a list of all quizzes
 *      tags: [Quizzes]
 *      responses:
 *          200:
 *              description: A list of all quizzes.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Quiz'
 */
router.get('/', quizController.getAllQuizzes);

// Export the module
module.exports = router;