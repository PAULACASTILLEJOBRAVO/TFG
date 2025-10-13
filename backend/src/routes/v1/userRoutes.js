// Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../../controllers/v1/userControllers');

// User routes
/** 
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

// Route to get all users
/**
 * @swagger
 * /v1/users:
 *   get:
 *      summary: Retrieve a list of all users
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: A list of all users.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                             $ref: '#/components/schemas/User'
 */
router.get('/', userController.getAllUsers);

//Export the module
module.exports = router;