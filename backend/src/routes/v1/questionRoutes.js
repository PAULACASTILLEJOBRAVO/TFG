// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const questionController = require('../../controllers/v1/questionControllers');

// Question routes
/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Question management and retrieval
 */

// Route to get all questions
/**
 * @swagger
 * /api/v1/questions:
 *   get:
 *      summary: Retrieve a list of all questions
 *      tags: [Questions]
 *      responses:
 *         200:
 *              description: A list of questions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Question'
 */
router.get('/', questionController.getAllQuestions);

// Export the module
module.exports = router;