//Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const quizController = require('../../controllers/v1/quizControllers');

// Quiz routes
/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: quiz management and retrieval
 */
router.use(authenticate);

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

// Route to get all quizzes created by a specific teacher
router.get('/my-teacher', quizController.getAllQuizzesForTeacher);

// Route to get all quizzes assigned to a specific student
router.get('/my-student', quizController.getAllQuizzesForStudent);

// Route to post an user
/**
 * @swagger
 * /v1/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizInput'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Quiz created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid quiz data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating quiz'
 *                 error:
 *                   type: string
 */
router.post('/', quizController.createQuiz);

// Route to restore a quiz by ID
router.patch('/restore/:id', quizController.restoreQuizById);

// Route to publish a quiz by ID
router.patch('/publish/:id', quizController.publishQuizById);

// Route to delete a quiz by ID
/**
 * @swagger
 * /v1/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz by ID
 *     description: Permanently removes a quiz from the database using its unique MongoDB ObjectId.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3cd3785388f1653996766"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizDeletionMetadata'
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz deleted successfully
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
 *         description: Server error while deleting quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting quiz
 *                 error:
 *                   type: string
 */
router.delete('/:id', quizController.deleteQuizById);

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

// Route to get a quiz by ID for a specific student
router.get('/student/:id', quizController.getQuizByIdForStudent);

// Route to get sessions and results for a specific quiz and teacher
router.get('/:id/sessions', quizController.getQuizSessionsForTeacher);

// Route
router.get('/:id/questions-analytics', quizController.getQuizQuestionAnalytics)

// Route to update a quiz by ID
router.patch('/:id', quizController.updateQuizById);

// Export the module
module.exports = router;