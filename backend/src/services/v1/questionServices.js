// Import models
const Question = require('../../models/Question');

// Question services
// Service to fetch all questions
const getAllQuestions = async () => {
    return await Question.find();
};

// Export service functions
module.exports = {
    getAllQuestions
};