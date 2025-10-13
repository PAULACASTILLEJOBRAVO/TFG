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
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Course'
 */
router.get('/', courseController.getAllCourses);


// Export the module
module.exports = router;