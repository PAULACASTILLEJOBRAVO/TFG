//Import modules
const express = require('express');
const router = express.Router();

// Import controllers
const courseController = require('../../controllers/v1/courseControllers');

// Course routes
// Route to get all courses
router.get('/', courseController.getAllCourses);


// Export the module
module.exports = router;