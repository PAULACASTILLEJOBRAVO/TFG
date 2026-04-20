//Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const clickerController = require('../../controllers/v1/clickerControllers');

// Clicker routes
/**
 * @swagger
 * tags:
 *   name: Clickers
 *   description: Clicker management and retrieval
 */
router.use(authenticate);

// Route to get all clickers
/**
 * @swagger
 * /v1/clickers:
 *   get:
 *      summary: Retrieve a list of all clickers
 *      tags: [Clickers]
 *      responses:
 *          200:
 *              description: A list of all clickers.
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Clickers fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Clicker'
 *          500:
 *              description: Server error while fetching clickers
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching clickers
 *                              error:
 *                                  type: string
 */
router.get('/', clickerController.getAllClickers);

// Route to get all clickers stats
router.get('/stats', clickerController.getTotalClickersStats);

// Route to get active clickers stats
router.get('/stats/active-clickers', clickerController.getActiveClickersStats);

// Route to get in use clickers stats
router.get('/stats/in-use-clickers', clickerController.getInUseClickersStats);

// Route to get available clickers stats
router.get('/stats/available-clickers', clickerController.getAvailableClickersStats);

// Route to get inactive clickers stats
router.get('/stats/inactive-clickers', clickerController.getInactiveClickersStats);

// Route to restore an clicker by ID
router.patch('/restore/:id', clickerController.restoreClickerById);

// Route to get a clicker by ID
/**
 * @swagger
 * /v1/clickers/{id}:
 *   get:
 *     summary: Retrieve a clicker by ID
 *     description: Retrieve a specific clicker by their unique MongoDB ObjectId.
 *     tags: [Clickers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28801d9eaff29b0c84538"
 *     responses:
 *       200:
 *         description: Clicker fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Clicker'
 *       400:
 *         description: Missing or invalid clicker ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker ID is required
 *       404:
 *         description: Clicker not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker not found
 *       500:
 *         description: Server error while fetching clicker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching clicker
 *                 error:
 *                   type: string
 */
router.get('/:id', clickerController.getClickerById);

// Route to post an clicker
/**
 * @swagger
 * /v1/clickers:
 *   post:
 *     summary: Create a new clicker
 *     tags: [Clickers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClickerInput'
 *     responses:
 *       201:
 *         description: Clicker created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clicker created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/Clicker'
 *       400:
 *         description: Invalid input entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid clicker data. Body is required'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating clicker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating clicker'
 *                 error:
 *                   type: string
 */
router.post('/', clickerController.createClicker);

// Route to delete a clicker by ID
/**
 * @swagger
 * /v1/clickers/{id}:
 *   delete:
 *     summary: Delete a clicker by ID
 *     description: Permanently removes a clicker from the database using its unique MongoDB ObjectId.
 *     tags: [Clickers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3b6e9d594bd08679250e5"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClickerDeletionMetadata'
 *     responses:
 *       200:
 *         description: Clicker deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker deleted successfully
 *       400:
 *         description: Missing or invalid clicker ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker ID is required
 *       404:
 *         description: Clicker not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clicker not found
 *       500:
 *         description: Server error while deleting clicker
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting clickerclicker
 *                 error:
 *                   type: string
 */

router.delete('/:id', clickerController.deleteClickerById);

// Route to update a clicker by ID
router.patch('/:id', clickerController.updateClickerById);

// Export the module
module.exports = router;