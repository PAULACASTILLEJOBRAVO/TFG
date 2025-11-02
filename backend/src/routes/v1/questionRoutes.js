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

// Route to post an user
/**
 * @swagger
 * /v1/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuestionInput'
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Question created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Question'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid question data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating question'
 *                 error:
 *                   type: string
 */
router.post('/', questionController.createQuestion);

// Route to delete a question by ID
/**
 * @swagger
 * /v1/questions/{id}:
 *   delete:
 *     summary: Delete a question by ID
 *     description: Permanently removes a question from the database using its unique MongoDB ObjectId.
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3c1e2d43ac378d6f3995a"
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question deleted successfully
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
 *         description: Server error while deleting question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting question
 *                 error:
 *                   type: string
 */

router.delete('/:id', questionController.deleteQuestionById);

// Export the module
module.exports = router;