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

// Service to delete a course by ID
const deleteCourseById = async (id) => {
    try {
        const course = await getCourseById(id);
        if (!course) return false; // If the course doesn't exist, return false

        await Course.findByIdAndDelete(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllCourses,
    getCourseById,
    
    createCourse,

    deleteCourseById,
};