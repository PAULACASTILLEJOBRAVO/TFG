//Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const courseController = require('../../controllers/v1/courseControllers');

// Course routes
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and retrieval
 */

// Route to get all courses
/**
 * @swagger
 * /v1/courses:
 *   get:
 *      summary: Retrieve a list of all courses
 *      tags: [Courses]
 *      responses:
 *          200:
 *              description: A list of all courses.
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              message:    
 *                                  type: string
 *                                  example: 'Course fetched successfully'
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Course'
 *          500:
 *              description: Server error while fetching course
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: Error fetching course
 *                              error:
 *                                  type: string
 */
router.get('/', courseController.getAllCourses);

// Route to get a course by ID
/**
 * @swagger
 * /v1/courses/{id}:
 *   get:
 *     summary: Retrieve a course by ID
 *     description: Retrieve a specific course by their unique MongoDB ObjectId.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "68e28801d9eaff29b0c84538"
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course fetched successfully
 *                 data: 
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Missing or invalid course ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course ID is required
 *       404:
 *         description: Course not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Course not found
 *       500:
 *         description: Server error while fetching course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching course
 *                 error:
 *                   type: string
 */
router.get('/:id', courseController.getCourseById);

// Route to post an user

router.post('/', courseController.createCourse);

// Export the module
module.exports = router;