//Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');
const { requireTeacherRole, requireAdminRole } = require('../../middleware/roles');

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

// Route to get all quizzes created by a specific teacher
/** 
 * @swagger
 * /v1/quizzes/my-teacher:
 *   get:
 *     summary: Get all quizzes created by the authenticated teacher
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: Quizzes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quizzes fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuizzesForTeacher'
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Server error while fetching quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching quizzes
 *                 error:
 *                   type: string
 */
router.get('/my-teacher', requireTeacherRole, quizController.getAllQuizzesForTeacher);

// Route to get all quizzes assigned to a specific student
/**
 * @swagger
 * /v1/quizzes/my-student:
 *   get:
 *     summary: Get all quizzes assigned to the authenticated student
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: Quizzes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quizzes fetched successfully
 *       500:
 *         description: Server error while fetching quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching quizzes
 *                 error:
 *                   type: string
 */
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
router.post('/', requireTeacherRole, quizController.createQuiz);

// Route to get a quiz by ID for a specific student
/**
 * @swagger
 * /v1/quizzes/{id}/student:
 *   get:
 *     summary: Retrieve a quiz by ID for a specific student
 *     description: Retrieve a specific quiz by their unique MongoDB ObjectId for a specific student.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28ac9d9eaff29b0c8453b"
 *       - in: query
 *         name: studentId
 *         required: false
 *         schema:
 *           type: string
 *           example: "64a7f0c2e4b0c8b1a1e4d3f2"
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
router.get('/:id/student', quizController.getQuizByIdForStudent);

// Route to get sessions and results for a specific quiz and teacher
/**
 * @swagger
 * /v1/quizzes/{id}/sessions:
 *   get:
 *     summary: Get sessions and results for a specific quiz and teacher
 *     description: Retrieve all sessions and their results for a specific quiz, accessible only to the teacher who created the quiz.
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
 *         description: Quiz sessions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz sessions fetched successfully
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
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
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
 *         description: Server error while fetching quiz sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching quiz sessions
 *                 error:
 *                   type: string
 */
router.get('/:id/sessions', requireTeacherRole, quizController.getQuizSessionsForTeacher);

// Route to get question analytics for a specific quiz and teacher
/**
 * @swagger
 * /v1/quizzes/{id}/questions-analytics:
 *   get:
 *     summary: Get question analytics for a specific quiz and teacher
 *     description: Retrieve analytics data for each question in a specific quiz, accessible only to the teacher who created the quiz.
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
 *         description: Question analytics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Question analytics fetched successfully
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
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized access
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
 *         description: Server error while fetching question analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching question analytics
 *                 error:
 *                   type: string
 */
router.get('/:id/questions-analytics', requireTeacherRole, quizController.getQuizQuestionAnalytics);

// Route to restore a quiz by ID
/**
 * @swagger
 * /v1/quizzes/{id}/restore:
 *   patch:
 *     summary: Restore a deleted quiz by ID
 *     description: Restores a previously deleted quiz using its unique MongoDB ObjectId.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3cd3785388f1653996766"
 *     responses:
 *       200:
 *         description: Quiz restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz restored successfully
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
 *         description: Server error while restoring quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error restoring quiz
 *                 error:
 *                   type: string
 */
router.patch('/:id/restore', requireTeacherRole, quizController.restoreQuizById);

// Route to publish a quiz by ID
/**
 * @swagger
 * /v1/quizzes/{id}/publish:
 *   patch:
 *     summary: Publish a quiz by ID
 *     description: Publishes a quiz, making it available for students to take, using its unique MongoDB ObjectId.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3cd3785388f1653996766"
 *     responses:
 *       200:
 *         description: Quiz published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz published successfully
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
 *         description: Server error while publishing quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error publishing quiz
 *                 error:
 *                   type: string
 */
router.patch('/:id/publish', requireTeacherRole, quizController.publishQuizById);

// Route to get a quiz by ID for a specific student
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

// Route to update a quiz by ID
/**
 * @swagger
 * /v1/quizzes/{id}:
 *   patch:
 *     summary: Update a quiz by ID
 *     description: Update the details of an existing quiz using its unique MongoDB ObjectId.
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28ac9d9eaff29b0c8453b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/QuizUpdateInput'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/QuizzesForTeacher'
 *       400:
 *         description: Missing or invalid quiz ID or body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz ID and body are required
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
 *         description: Server error while updating quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating quiz
 *                 error:
 *                   type: string
 */
router.patch('/:id', requireTeacherRole, quizController.updateQuizById);

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
router.delete('/:id', requireTeacherRole, quizController.deleteQuizById);

// Export the module
module.exports = router;