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


// Export the module
module.exports = router;