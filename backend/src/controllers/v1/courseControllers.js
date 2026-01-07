// Import services
const courseServices = require('../../services/v1/courseServices');

// Import models
const User = require('../../models/User');

// Course controllers
// Controller to get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseServices.getAllCourses();
        res.status(200).json({
            message: 'Courses fetched successfully', 
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

// Controller to get courses' stats
const getActiveCoursesStatsForTeacher = async (req, res) => {
    const currentUser = req.user;

    try {
        const canAccess = await User.canGetTeacherStats(currentUser);
        if(!canAccess) return res.status(403).json({message: "Not authorized"});

        const courses = await courseServices.getActiveCoursesStatsForTeacher(currentUser._id);
        res.status(200).json({
            message: "Courses' stats fetched successfully", 
            data: courses
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching courses' stats", 
            error: error.message 
        });
    }
}

// Controller to create a new course
const createCourse = async (req, res) => {
    const {body} = req;
    const { _id, role } = req.user;

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

// Controller to delete a course by ID
const deleteCourseById = async (req, res) => {
    const {id} = req.params;
    const { by, reason } = req.body; 

    if(!id) return res.status(400).json({ message: 'Course ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await courseServices.deleteCourseById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'Course not found' });

        res.status(200).json({
         message: 'Course deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting course',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllCourses,
    getCourseById,
    getActiveCoursesStatsForTeacher,

    createCourse,

    deleteCourseById,
};