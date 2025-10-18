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

// Service to create a new user
const createQuiz = async (body) => {
    try{
        return await Quiz.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export service functions
module.exports = {
    getAllQuizzes,
    getQuizById,

    createQuiz
};