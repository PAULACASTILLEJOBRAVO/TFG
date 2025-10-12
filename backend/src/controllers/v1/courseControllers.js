// Import services
const courseServices = require('../../services/v1/courseServices');

// Course controllers
// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseServices.getAllCourses();
        res.status(200).json({
            message: 'Courses fetched successful', 
            courses: courses
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching courses', 
            error: error.message 
        });
    }
};

// Export controllers functions
module.exports = {
    getAllCourses
};