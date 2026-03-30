// Import models
const Result = require('../../models/Result');
const Session = require('../../models/Session');
const Response = require('../../models/Response');

// Result services
// Service to get all results
const getAllResults = async () => {
  return await Result.find().populate('playerId').populate('quizId').populate('sessionId');
};

// Service to get a result by ID
const getResultById = async (id) => {
  return await Result.findById(id).populate('playerId').populate('quizId').populate('sessionId');
}

// Service to generate results for a session
const generateResults = async ({playerId, sessionId}) => {
  // Get the session and quiz
  const session = await Session.findById(sessionId).populate({
    path: 'quizId',
    populate: {
      path: 'questionIds'
    }
  });
  const quiz = session.quizId;

  if (!session || !quiz) throw new Error('Session or Quiz not found');

  const totalQuestions = quiz.questionIds.length;

  // Get all responses for the players in the session
  const responses = await Response.find({ sessionId, playerId });

  // Create a map of questionId to response for the player
  const questionMap = new Map();
  quiz.questionIds.forEach(q => {
    questionMap.set(q._id.toString(), q); // Map questionId to question details
  });

  let correctAnswers = 0;
  let wrongAnswers = 0;

  // Evaluate responses
  responses.forEach(response => {
    const question = questionMap.get(response.questionId.toString());
    if (!question) return; // Skip if the question is not part of the quiz

    const index = response.answer.charCodeAt(0) - 65; 
    const selectedOption = question.options[index];

    if (selectedOption?.isCorrect) {
      correctAnswers++;
    } else {
      wrongAnswers++;
    }
  });

  const totalAnswers = responses.length;
  const unansweredQuestions = totalQuestions - totalAnswers; 

  // Time 
  const startedAt = session.startTime;
  const finishedAt = session.endTime || new Date();
  const timeTaken = Math.floor((finishedAt - startedAt) / 1000); // Time in seconds

  // Score
  const totalScore = responses.reduce(
    (score, response) => score + (response.pointsAwarded || 0), 
    0
  );

  // Create and save the result
  const result = new Result({
      totalScore,
      correctAnswers,
      wrongAnswers,
      unansweredQuestions,
      totalQuestions,
      rank: 0,
      playerId,
      sessionId,
      quizId: quiz._id,
      timeTaken,
      startedAt,
      finishedAt
  });

  await result.save();

  return result;
}

// Service to calculate ranks for a session
const calculateRanks = async (sessionId) => {
  const results = await Result.find({ sessionId }).sort({ totalScore: -1, timeTaken: 1 });

  const bulkOps = results.map((result, index) => ({
    updateOne: {
      filter: { _id: result._id },
      update: { rank: index + 1 }
    }
  }));

  await Result.bulkWrite(bulkOps); // Update ranks in a single operation 

  return results;
}

// Export result services
module.exports = {
  getAllResults,
  getResultById,

  generateResults,
  calculateRanks
};