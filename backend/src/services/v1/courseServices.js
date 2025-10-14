// Import models
const Course = require('../../models/Course');

// Course services
// Service to fetch all courses
const getAllCourses = async () => {
    return await Course.find().populate('teacherId').populate('studentIds').populate('quizIds');
};

// Service to fetch a course by ID
const getCourseById = async (id) => {
    return await Course.findById(id).populate('teacherId').populate('studentIds').populate('quizIds');
}

// Export service functions
module.exports = {
    getAllCourses,
    getCourseById
};