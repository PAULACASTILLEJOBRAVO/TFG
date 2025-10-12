// Import models
const Quiz = require('../../models/Quiz');

// Quiz services
// Service to fetch all quizzes
const getAllQuizzes = async () => {
    return await Quiz.find().populate('creatorId').populate('courseId').populate('questionIds');
};

// Export service functions
module.exports = {
    getAllQuizzes
};