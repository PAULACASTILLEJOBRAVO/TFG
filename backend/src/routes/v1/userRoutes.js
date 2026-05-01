// Import modules
const express = require('express');
const router = express.Router();

// Import middleware
const { authenticate } = require('../../middleware/authentication');
const { requireTeacherRole, requireAdminRole } = require('../../middleware/roles');

// Import controllers
const userController = require('../../controllers/v1/userControllers');

// User routes
/** 
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */
router.use(authenticate);

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
router.get('/', requireAdminRole, userController.getAllUsers);

// Route to get the user profile of the authenticated user
/**
 * @swagger
 * /v1/users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User profile fetched successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User not found'
 *       500:
 *         description: Server error while fetching user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching user profile'
 *                 error:
 *                   type: string
 */
router.get("/me", userController.getMe);

// Route to get users stats
/** 
 * @swagger
 * /v1/users/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User statistics fetched successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 100
 *       500:
 *         description: Server error while fetching user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching user statistics'
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/stats', requireAdminRole, userController.getTotalUsersStats);

// Route to get active users stats
/**
 * @swagger
 * /v1/users/stats/active:
 *   get:
 *     summary: Get active user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Active user statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Active user statistics fetched successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     activeUsers:
 *                       type: integer
 *                       example: 80
 *       500:
 *         description: Server error while fetching active user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching active user statistics'
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/stats/active', requireAdminRole, userController.getActiveUsersStats);

// Route to get connected users stats
/**
 * @swagger
 * /v1/users/stats/connected:
 *   get:
 *     summary: Get connected user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Connected user statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Connected user statistics fetched successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     connectedUsers:
 *                       type: integer
 *                       example: 60
 *       500:
 *         description: Server error while fetching connected user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching connected user statistics'
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/stats/connected', requireAdminRole, userController.getConnectedUsersStats);

// Route to get archived users stats
/**
 * @swagger
 * /v1/users/stats/archived:
 *   get:
 *     summary: Get archived user statistics
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Archived user statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Archived user statistics fetched successfully'
 *                 data:
 *                   type: object
 *                   properties:
 *                     archivedUsers:
 *                       type: integer
 *                       example: 20
 *       500:
 *         description: Server error while fetching archived user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching archived user statistics'
 *                 error:
 *                   type: string
 */
router.get('/stats/archived', requireAdminRole, userController.getArchivedUsersStats);

// Route to get students for teacher
/**
 * @swagger
 * /v1/users/students-for-teacher:
 *   get:
 *     summary: Get students for teacher
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Students for teacher retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Students for teacher fetched successfully'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - User does not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - You do not have permission to access this resource'
 *       500:
 *         description: Server error while fetching students for teacher
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching students for teacher'
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/students-for-teacher', requireTeacherRole, userController.getAllStudentsForTeacher);

// Route to get students for admin
/**
 * @swagger
 * /v1/users/students-for-admin:
 *   get:
 *     summary: Get students for admin
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Students for admin retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Students for admin fetched successfully'
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - User does not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Forbidden - You do not have permission to access this resource'
 *       500:
 *         description: Server error while fetching students for admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error fetching students for admin'
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
router.get('/students-for-admin', requireAdminRole, userController.getAllStudentsForAdmin);

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
router.post('/', requireAdminRole, userController.createUser);

// Route to restore an user by ID
/**
 * @swagger
 * /v1/users/{id}/restore:
 *   patch:
 *     summary: Restore a user by ID
 *     description: Restores a previously deleted user by ID.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f270d1e556829877241f19"
 *     responses:
 *       200:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User restored successfully'
 */
router.patch('/:id/restore', requireAdminRole, userController.restoreUserById);

// Route to update an user's password by ID
/**
 * @swagger
 * /v1/users/{id}/password:
 *   patch:
 *     summary: Update a user's password by ID
 *     description: Updates the password of a user by ID.
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
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: 'newSecurePassword123'
 *     responses:
 *       200:
 *         description: User password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User password updated successfully'
 *       400:
 *         description: Invalid input or missing new password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'New password is required'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User not found'
 *       500:
 *         description: Server error while updating user password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating user password'
 *                 error:
 *                   type: string
 */
router.patch('/:id/password', requireAdminRole, userController.updatePasswordById);

// Route to update an user by ID
/**
 * @swagger
 * /v1/users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     description: Updates the details of a user by ID.
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
 *             $ref: '#/components/schemas/UserUpdateInput'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User updated successfully'
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or missing required fields
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
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User not found'
 *       500:
 *         description: Server error while updating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error updating user'
 *                 error:
 *                   type: string
 */
router.patch('/:id', userController.updateUserById);

// Route to delete an user by ID
/**
 * @swagger
 * /v1/users/{id}/archive:
 *   post:
 *     summary: Archive a user by ID
 *     description: Archives a User in the database using its unique MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f270d1e556829877241f19"
 *     responses:
 *       200:
 *         description: User archived successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User archived successfully
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
 *         description: Server error while archiving user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error archiving user
 *                 error:
 *                   type: string
 */
router.post('/:id/archive', requireAdminRole, userController.archiveUserById);

// Route to delete an user permanently by ID
/**
 * @swagger
 * /v1/users/{id}:
 *   delete:
 *     summary: Delete a user permanently by ID
 *     description: Deletes a user permanently from the database using its unique MongoDB ObjectId.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68f270d1e556829877241f19"
 *     responses:
 *       200:
 *         description: User deleted permanently successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted permanently successfully
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
 *         description: Server error while deleting user permanently
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error deleting user permanently
 *                 error:
 *                   type: string
 */
router.delete('/:id', requireAdminRole, userController.deleteUserPermanentlyById);

//Export the module
module.exports = router;