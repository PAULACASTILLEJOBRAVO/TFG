// Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const difficultyController = require('../../controllers/v1/difficultyControllers');

// Difficulty routes
/** 
 * @swagger
 * tags:
 *   name: Difficulties
 *   description: Difficulty management and retrieval
 */
router.use(authenticate);

// Route to get all difficulties
/**
 * @swagger
 * /v1/difficulties:
 *   get:
 *      summary: Retrieve a list of all difficulties
 *      tags: [Difficulties]
 *      responses:
 *          200:
 *              description: A list of all difficulties.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Difficulties fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Difficulty'
 *          500:
 *              description: Server error while fetching difficulty
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching difficulty
 *                              error:
 *                                  type: string
 */
router.get('/', difficultyController.getAllDifficulties);

//Export the module
module.exports = router;