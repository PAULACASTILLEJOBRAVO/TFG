//Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const quizController = require('../../controllers/v1/quizControllers');

// Quiz routes
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
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Quizzes fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Quiz'
 *          500:
 *              description: Server error while fetching quizzes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching quizzes
 *                              error:
 *                                  type: string
 */
router.get('/', quizController.getAllQuizzes);

/**
 * @swagger
 * /v1/quizzes/{id}:
 *   get:
 *     summary: Retrieve a quiz by ID
 *     description: Retrieve a specific quiz by their unique MongoDB ObjectId.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28ac9d9eaff29b0c8453b"
 *     responses:
 *       200:
 *         description: Quiz fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Missing or invalid quiz ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz ID is required
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz not found
 *       500:
 *         description: Server error while fetching quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching quiz
 *                 error:
 *                   type: string
 */
router.get('/:id', quizController.getQuizById);

// Route to post an user

router.post('/', quizController.createQuiz);

// Export the module
module.exports = router;