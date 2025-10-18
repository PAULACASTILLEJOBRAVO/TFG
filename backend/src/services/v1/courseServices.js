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

// Service to create a new course
const createCourse = async (body) => {
    try{
        return await Course.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export service functions
module.exports = {
    getAllCourses,
    getCourseById,
    
    createCourse
};