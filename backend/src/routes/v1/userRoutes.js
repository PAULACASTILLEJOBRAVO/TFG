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
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Users fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/User'
 *          500:
 *              description: Server error while fetching user
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching user
 *                              error:
 *                                  type: string
 */
router.get('/', userController.getAllUsers);

// Route to get an user by ID
/**
 * @swagger
 * /v1/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     description: Retrieve a specific user by their unique MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28135fe97fd5d3f0cc3a4"
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing or invalid user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user
 *                 error:
 *                   type: string
 */
router.get('/:id', userController.getUserById);

// Route to post an user
/**
 * @swagger
 * /v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User created successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or duplicate entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid user data'
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error creating user'
 *                 error:
 *                   type: string
 */
router.post('/', userController.createUser);

// Route to delete an user by ID
/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Permanently removes a User from the database using its unique MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f270d1e556829877241f19"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDeletionMetadata'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       400:
 *         description: Missing or invalid {{modelo}} ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User ID is required
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting user
 *                 error:
 *                   type: string
 */
router.delete('/:id', userController.deleteUserById);

//Export the module
module.exports = router;