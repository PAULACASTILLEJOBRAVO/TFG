// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const responseController = require('../../controllers/v1/responseControllers');

// Response routes
/**
 * @swagger
 * tags:
 *   name: Responses
 *   description: Response management and retrieval
 */

// Route to get all responses
/**
 * @swagger
 * /v1/responses:
 *   get:
 *      summary: Retrieve a list of all responses
 *      tags: [Responses]
 *      responses:
 *          200:
 *              description: A list of all responses
 *              content:
 *                  application/json:
 *                      schema:          
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Responses fetched successfully
 *                              data: 
 *                                  $ref: '#/components/schemas/Response'
 *          500:
 *              description: Server error while fetching response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching response
 *                              error:
 *                                  type: string
 */
router.get('/', responseController.getAllResponses);

// Route to get a response by ID
/**
 * @swagger
 * /v1/responses/{id}:
 *   get:
 *     summary: Retrieve a response by ID
 *     description: Retrieve a specific response by their unique MongoDB ObjectId.
 *     tags: [Responses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e293da07f386d8b2fdf3d9"
 *     responses:
 *       200:
 *         description: Response fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Response fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Response'
 *       400:
 *         description: Missing or invalid response ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Response ID is required
 *       404:
 *         description: Response not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Response not found
 *       500:
 *         description: Server error while fetching response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching response
 *                 error:
 *                   type: string
 */
router.get('/:id', responseController.getResponseById);

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
 *         description: Resposne created successfully
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