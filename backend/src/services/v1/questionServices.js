// Import models
const Question = require('../../models/Question');

// Question services
// Service to fetch all questions
const getAllQuestions = async () => {
    return await Question.find();
};

// Service to fetch a question by ID
const getQuestionById = async (id) => {
    return await Question.findById(id);
}

// Service to create a new question
const createQuestion = async (body) => {
    try{
        return await Question.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export service functions
module.exports = {
    getAllQuestions,
    getQuestionById,

    createQuestion
};