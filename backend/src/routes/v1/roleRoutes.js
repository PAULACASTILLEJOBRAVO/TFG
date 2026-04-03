// Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');

// Import controllers
const roleController = require('../../controllers/v1/roleControllers');

// Role routes
/** 
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management and retrieval
 */
router.use(authenticate);

// Route to get all roles
/**
 * @swagger
 * /v1/roles:
 *   get:
 *      summary: Retrieve a list of all roles
 *      tags: [Roles]
 *      responses:
 *          200:
 *              description: A list of all roles.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Roles fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Role'
 *          500:
 *              description: Server error while fetching role
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching role
 *                              error:
 *                                  type: string
 */
router.get('/', roleController.getAllRoles);

//Export the module
module.exports = router;