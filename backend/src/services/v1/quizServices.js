// Import models
const Quiz = require('../../models/Quiz');

// Quiz services
// Service to fetch all quizzes
const getAllQuizzes = async () => {
    return await Quiz.find().populate('creatorId').populate('courseId').populate('questionIds');
};

// Service to fetch a quiz by ID
const getQuizById = async (id) => {
    return await Quiz.findById(id).populate('creatorId').populate('courseId').populate('questionIds');
}

// Export service functions
module.exports = {
    getAllQuizzes,
    getQuizById
};