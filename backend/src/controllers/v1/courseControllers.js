// Import services
const courseServices = require('../../services/v1/courseServices');

// Course controllers
// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseServices.getAllCourses();
        res.status(200).json({
            message: 'Courses fetched successful', 
            data: courses
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching courses', 
            error: error.message 
        });
    }
};

// Controller to get a course by ID
const getCourseById = async (req, res) => {
    const {id} = req.params;

    if (!id) return res.status(400).json({ message: 'Course ID is required' });
        
    try{
        const course = await courseServices.getCourseById(id);

        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        res.status(200).json({
            message: 'Course fetched successfully', 
            data: course
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching course', 
            error: error.message 
        });
    } 
}

// Controller to create a new course
const createCourse = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid course data. Body is required' });

    try{
        const newCourse = await courseServices.createCourse(body);

        res.status(201).json({
            message: 'Course created successfully', 
            data: newCourse
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating course', 
            error: error.message 
        });
    }
}

// Export controllers functions
module.exports = {
    getAllCourses,
    getCourseById,

    createCourse
};