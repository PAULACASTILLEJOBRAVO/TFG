// Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const responseController = require('../../controllers/v1/responseControllers');

// Response routes
/**
 * @swagger
 * tags:
 *   name: Responses
 *   description: Response management and retrieval
 */
router.use(authenticate);

// Route to post an user
/**
 * @swagger
 * /v1/responses:
 *   post:
 *     summary: Create a new response
 *     tags: [Responses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResponseInput'
 *     responses:
 *       201:
 *         description: Response created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Response created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Response'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid response data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating response'
 *                 error:
 *                   type: string
 */
router.post('/', responseController.createResponse);

// Export the module
module.exports = router;