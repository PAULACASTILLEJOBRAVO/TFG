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
 *   description: Clicker management and retrieval - All routes require admin authentication
 */
router.use(authenticate);

// Route to get all clickers stats
/** @swagger
 * /v1/clickers/stats:
 *   get:
 *     summary: Get statistics for all clickers
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clickers' stats fetched successfully"
 *                 data:
 *                   type: Number
 *                   example: 15
 *       403:
 *         description: Unauthorized access to clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error while fetching clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching clickers stats'
 *                 error:
 *                   type: string
 */
router.get('/stats', clickerController.getTotalClickersStats);

// Route to get active clickers stats
/** @swagger 
 * /v1/clickers/stats/active-clickers:
 *   get:
 *     summary: Get statistics for active clickers
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active clickers statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clickers' stats fetched successfully"
 *                 data:
 *                   type: Number
 *                   example: 10
 *       403:
 *         description: Unauthorized access to active clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error while fetching active clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching active clickers stats'
 *                 error:
 *                   type: string
*/
router.get('/stats/active-clickers', clickerController.getActiveClickersStats);

// Route to get in use clickers stats
/** @swagger
 * /v1/clickers/stats/in-use-clickers:
 *   get:
 *     summary: Get statistics for in use clickers
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: In use clickers statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clickers' stats fetched successfully"
 *                 data:
 *                   type: Number
 *                   example: 5
 *       403:
 *         description: Unauthorized access to in use clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error while fetching in use clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching in use clickers stats'
 *                 error:
 *                   type: string
 */
router.get('/stats/in-use-clickers', clickerController.getInUseClickersStats);

// Route to get available clickers stats
/** @swagger
 * /v1/clickers/stats/available-clickers:
 *   get:
 *     summary: Get statistics for available clickers
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available clickers statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clickers' stats fetched successfully"
 *                 data:
 *                   type: Number
 *                   example: 8
 *       403:
 *         description: Unauthorized access to available clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error while fetching available clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching available clickers stats'
 *                 error:
 *                   type: string
 */
router.get('/stats/available-clickers', clickerController.getAvailableClickersStats);

// Route to get inactive clickers stats
/** @swagger
 * /v1/clickers/stats/inactive-clickers:
 *   get:
 *     summary: Get statistics for inactive clickers
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inactive clickers statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Clickers' stats fetched successfully"
 *                 data:
 *                   type: Number
 *                   example: 3
 *       403:
 *         description: Unauthorized access to inactive clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized'
 *       500:
 *         description: Server error while fetching inactive clickers stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching inactive clickers stats'
 *                 error:
 *                   type: string
 */
router.get('/stats/inactive-clickers', clickerController.getInactiveClickersStats);

// Route to get all clickers
/**
 * @swagger
 * /v1/clickers:
 *   get:
 *      summary: Retrieve a list of all clickers
 *      tags: [Clickers]
 *      security:
 *       - bearerAuth: []
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

// Route to post an clicker
/**
 * @swagger
 * /v1/clickers:
 *   post:
 *     summary: Create a new clicker
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
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
 *       409:
 *         description: Clicker with the same device code already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'The clicker already exists'
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

// Route to restore an clicker by ID
/** @swagger
 * /v1/clickers/{id}/restore:
 *   patch:
 *     summary: Restore a clicker by ID
 *     description: Restores a previously deleted clicker using its unique MongoDB ObjectId.
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3b6e9d594bd08679250e5"
 *     responses:
 *       200:
 *         description: Clicker restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clicker restored successfully'
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
 *                   example: 'Invalid clicker ID'
 *       404:
 *         description: Clicker not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clicker not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.patch('/:id/restore', clickerController.restoreClickerById);

// Route to update a clicker by ID
/** @swagger
 * /v1/clickers/{id}:
 *   patch:
 *     summary: Update a clicker by ID
 *     description: Updates the details of an existing clicker using its unique MongoDB ObjectId.
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/ClickerUpdateInput'
 *     responses:
 *       200:
 *         description: Clicker updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clicker updated successfully'
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
 *                   example: 'Invalid clicker ID'
 *       404:
 *         description: Clicker not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Clicker not found'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal server error'
 *                 error:
 *                   type: string
 */
router.patch('/:id', clickerController.updateClickerById);

// Route to delete a clicker by ID
/**
 * @swagger
 * /v1/clickers/{id}:
 *   delete:
 *     summary: Delete a clicker by ID
 *     description: Permanently removes a clicker from the database using its unique MongoDB ObjectId.
 *     tags: [Clickers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f3b6e9d594bd08679250e5"
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

// Export the module
module.exports = router;