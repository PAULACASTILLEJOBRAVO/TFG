// Import models
const Response = require('../../models/Response');
const Clicker = require('../../models/Clicker');
const Question = require('../../models/Question');

// Import debug
const debug = require('debug')('backend:services:v1:responseServices');

// Response services
// Service to create a new response
const createResponse = async (body) => {
    const {sessionId, questionId, deviceId, answer} = body;
    
    try{
        debug('Creating response with body:', body);
        const clicker = await Clicker.findOne({ deviceCode: deviceId, status: "assigned" });
        if (!clicker) throw new Error('Clicker not found');

        debug('Found clicker:', clicker);
        const question = await Question.findById(questionId);
        if (!question) throw new Error('Question not found');

        debug('Found question:', question);
        const playerId = clicker.assignedToUserId;

        debug(`Processing response for player ID: ${playerId}, question ID: ${questionId}, answer: ${answer}`);

        // Convert answer (e.g., "A", "B", "C") to index (0, 1, 2) and check if it's correct
        const answerIndex = answer.toUpperCase().charCodeAt(0) - 65;
        const selectedOption = question.options[answerIndex];

        const isCorrect = selectedOption?.isCorrect || false;
        const pointsAwarded = isCorrect ? question.points : 0;

        debug(`Answer is ${isCorrect ? 'correct' : 'incorrect'}. Points awarded: ${pointsAwarded}`);
        return await Response.create({
            questionId,
            sessionId,
            playerId,
            isCorrect,
            answer,
            pointsAwarded
        });
    } catch(error){
        debug('Error creating response:', error.message);
        throw new Error(error.message);
    }
}

// Export response services
module.exports = {
  createResponse,
};