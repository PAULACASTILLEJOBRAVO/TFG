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

// Service to delete a question by ID
const deleteQuestionById = async (id) => {
    try {
        const question = await getQuestionById(id);
        if (!question) return false; // If the question doesn't exist, return false

        await Question.softDeleteById(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllQuestions,
    getQuestionById,

    createQuestion,

    deleteQuestionById,
};