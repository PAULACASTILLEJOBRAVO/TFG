// Import models
const Response = require('../../models/Response');
const Clicker = require('../../models/Clicker');
const Question = require('../../models/Question');

// Response services
// Service to get all responses
const getAllResponses = async () => {
  return await Response.find().populate('playerId').populate('questionId').populate('sessionId');
};

// Service to get a response by ID
const getResponseById = async (id) => {
  return await Response.findById(id).populate('playerId').populate('questionId').populate('sessionId');
}

// Service to create a new response
const createResponse = async (body) => {
    const {sessionId, questionId, deviceId, answer} = body;
    
    try{
        const clicker = await Clicker.findOne({ deviceCode: deviceId, status: "assigned" });
        if (!clicker) throw new Error('Clicker not found');

        const question = await Question.findById(questionId);
        if (!question) throw new Error('Question not found');

        const playerId = clicker.assignedToUserId;

        // Convert answer (e.g., "A", "B", "C") to index (0, 1, 2) and check if it's correct
        const answerIndex = answer.toUpperCase().charCodeAt(0) - 65;
        const selectedOption = question.options[answerIndex];

        const isCorrect = selectedOption?.isCorrect || false;
        const pointsAwarded = isCorrect ? question.points : 0;

        return await Response.create({
            questionId,
            sessionId,
            playerId,
            isCorrect,
            answer,
            pointsAwarded
        });
    } catch(error){
        throw error.message;
    }
}

// Export response services
module.exports = {
  getAllResponses,
  getResponseById,

  createResponse,
};