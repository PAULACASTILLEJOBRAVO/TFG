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


// Export the module
module.exports = router;