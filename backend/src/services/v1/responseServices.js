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
        const clicker = await Clicker.findOne({ deviceCode: deviceId, isDeleted: false });
        if (!clicker) throw new Error('Clicker not found');

        const question = await Question.findById(questionId);
        if (!question) throw new Error('Question not found');

        const playerId = clicker.assignedToUserId;

        // Convert answer (e.g., "A", "B", "C") to index (0, 1, 2) and check if it's correct
        const answerIndex = answer.toUpperCase().charCodeAt(0) - 65;
        console.log("Answer index:", answerIndex);
        const selectedOption = question.options[answerIndex];
        console.log("Selected option:", selectedOption);

        const isCorrect = selectedOption?.isCorrect || false;
        console.log("Is the answer correct?", isCorrect);
        const pointsAwarded = isCorrect ? question.points : 0;
        console.log("Points awarded:", pointsAwarded);

        console.log("Response details - Question ID:", questionId);
        console.log("Session ID:", sessionId);
        console.log("Player ID:", playerId);
        console.log("Answer:", answer);
        console.log("Is Correct:", isCorrect);
        console.log("Points Awarded:", pointsAwarded);

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