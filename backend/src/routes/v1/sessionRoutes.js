// Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const sessionController = require('../../controllers/v1/sessionControllers');

// Session routes
/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management and retrieval
 */
router.use(authenticate);

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

// Route to complete a session by ID
/**
 * @swagger
 * /v1/sessions/{id}/complete:
 *   patch:
 *     summary: Mark a session as completed
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     responses:
 *       200:
 *         description: Session marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session marked as completed successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid session ID or missing body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session ID is required'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session not found'
 *       500:
 *         description: Server error while updating session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating session'
 *                 error:
 *                   type: string
 */
router.patch('/:id/complete', sessionController.completeSessionById);

// Route to update a session by ID
/**
 * @swagger
 * /v1/sessions/{id}:
 *   patch:
 *     summary: Update a session by ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The session ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Session'
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session updated successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid session ID or missing body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session ID is required'
 *       404:
 *         description: Session not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Session not found'
 *       500:
 *         description: Server error while updating session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating session'
 *                 error:
 *                   type: string
 */
router.patch('/:id', sessionController.updateSessionById);

// Export the module
module.exports = router;