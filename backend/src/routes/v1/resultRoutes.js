// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const resultController = require('../../controllers/v1/resultControllers');

// Result routes
/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Result management and retrieval
 */
// Route to get all results
/**
 * @swagger
 * /v1/results:
 *  get:
 *      summary: Retrieve a list of all results
 *      tags: [Results]
 *      responses:
 *          200:
 *              description: A list of all results
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Results fetched successfully
 *                              data: 
 *                                  $ref: '#/components/schemas/Result'
 *          500:
 *              description: Server error while fetching result
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching result
 *                              error:
 *                                  type: string
 */
router.get('/', resultController.getAllResults);

// Route to get a result by ID
/**
 * @swagger
 * /v1/results/{id}:
 *   get:
 *     summary: Retrieve a result by ID
 *     description: Retrieve a specific result by their unique MongoDB ObjectId.
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e293da07f386d8b2fdf3d9"
 *     responses:
 *       200:
 *         description: Result fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: result fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Result'
 *       400:
 *         description: Missing or invalid result ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Result ID is required
 *       404:
 *         description: Result not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Result not found
 *       500:
 *         description: Server error while fetching result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching result
 *                 error:
 *                   type: string
 */
router.get('/:id', resultController.getResultById);

// Route to post an user
/**
 * @swagger
 * /v1/results:
 *   post:
 *     summary: Create a new result
 *     tags: [Results]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResultInput'
 *     responses:
 *       201:
 *         description: Result created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Result created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Result'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid result data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating result'
 *                 error:
 *                   type: string
 */
router.post('/', resultController.createResult);

// Route to delete a result by ID
/**
 * @swagger
 * /v1/results/{id}:
 *   delete:
 *     summary: Delete a result by ID
 *     description: Permanently removes a result from the database using its unique MongoDB ObjectId.
 *     tags: [Results]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3e05ceaf212f6ed41e5bd"
 *     responses:
 *       200:
 *         description: Result deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Result deleted successfully
 *       400:
 *         description: Missing or invalid result ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Result ID is required
 *       404:
 *         description: Result not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Result not found
 *       500:
 *         description: Server error while deleting result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting result
 *                 error:
 *                   type: string
 */
router.delete('/:id', resultController.deleteResultById);

// Export the module
module.exports = router;