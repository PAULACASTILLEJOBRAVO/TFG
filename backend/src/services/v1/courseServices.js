// Import models
const Course = require('../../models/Course');

// Course services
// Service to fetch all courses
const getAllCourses = async () => {
    return await Course.find().populate('teacherId').populate('studentIds').populate('quizIds');
};

// Export service functions
module.exports = {
    getAllCourses
};