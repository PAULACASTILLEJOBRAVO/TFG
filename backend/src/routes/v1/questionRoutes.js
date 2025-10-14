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
 * /v1/questions:
 *   get:
 *      summary: Retrieve a list of all questions
 *      tags: [Questions]
 *      responses:
 *         200:
 *              description: A list of questions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Questions fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Question'
 *         500:
 *              description: Server error while fetching question
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching question
 *                              error:
 *                                  type: string
 */
router.get('/', questionController.getAllQuestions);

/**
 * @swagger
 * /v1/questions/{id}:
 *   get:
 *     summary: Retrieve a question by ID
 *     description: Retrieve a specific question by their unique MongoDB ObjectId.
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28c93d9eaff29b0c8453d"
 *     responses:
 *       200:
 *         description: Question fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Missing or invalid question ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question ID is required
 *       404:
 *         description: Question not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question not found
 *       500:
 *         description: Server error while fetching question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching question
 *                 error:
 *                   type: string
 */
router.get('/:id', questionController.getQuestionById);

// Export the module
module.exports = router;