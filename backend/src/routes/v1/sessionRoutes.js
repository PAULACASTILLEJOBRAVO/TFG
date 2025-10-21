// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const sessionController = require('../../controllers/v1/sessionControllers');

// Session routes
/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management and retrieval
 */

// Route to get all sessions
/**
 * @swagger
 * /v1/sessions:
 *   get:
 *     summary: Retrieve a list of all sessions
 *     tags: [Sessions]
 *     responses:
 *          200:
 *              description: A list of sessions
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Sessions fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Session'
 *          500:
 *              description: Server error while fetching session
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching session
 *                              error:
 *                                  type: string
 */
router.get('/', sessionController.getAllSessions);

/**
 * @swagger
 * /v1/sessions/{id}:
 *   get:
 *     summary: Retrieve a session by ID
 *     description: Retrieve a specific session by their unique MongoDB ObjectId.
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e292c396c23e98e31b1604"
 *     responses:
 *       200:
 *         description: Session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Missing or invalid session ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session ID is required
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session not found
 *       500:
 *         description: Server error while fetching session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching session
 *                 error:
 *                   type: string
 */
router.get('/:id', sessionController.getSessionById);


// Route to post an user
/**
 * @swagger
 * /v1/sessions:
 *   post:
 *     summary: Create a new session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SessionInput'
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid session data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating session'
 *                 error:
 *                   type: string
 */
router.post('/', sessionController.createSession);

// Export the module
module.exports = router;