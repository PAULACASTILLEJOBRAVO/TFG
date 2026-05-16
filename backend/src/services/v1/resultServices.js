// Import models
const Result = require('../../models/Result');
const Session = require('../../models/Session');
const Response = require('../../models/Response');

// Debugging
const debug = require('debug')('backend:services:v1:resultServices');

// Result services
// Service to generate results for a session (called when a session is completed in sessionServices)
const generateResults = async ({playerId, sessionId}) => {
  debug(`Generating results for session ID ${sessionId} and player ID ${playerId}`);
  // Get the session and quiz
  const session = await Session.findById(sessionId).populate({
    path: 'quizId',
    populate: {
      path: 'questionIds'
    }
  });
  debug(`Session fetched for session ID ${sessionId}:`, session);

  const quiz = session.quizId;
  debug(`Quiz fetched for session ID ${sessionId}:`, quiz);

  if (!session || !quiz) throw new Error('Session or Quiz not found');
  debug(`Session and quiz found:`, session, quiz);

  const totalQuestions = quiz.questionIds.length;

  // Get all responses for the players in the session
  debug(`Fetching responses for session ID ${sessionId} and player ID ${playerId}`);
  const responses = await Response.find({ sessionId, playerId });

  // Create a map of questionId to response for the player
  debug(`Mapping responses for player ID ${playerId}`);
  const questionMap = new Map();

  quiz.questionIds.forEach(q => {
    questionMap.set(q._id.toString(), q); // Map questionId to question details
  });

  let correctAnswers = 0;
  let wrongAnswers = 0;

  // Evaluate responses
  debug(`Evaluating responses for player ID ${playerId}`);
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
  const validResponses = responses.filter(r => r.answeredAt);
  debug(`Valid responses with answeredAt for player ID ${playerId}:`, validResponses);

  let startedAt = null;
  let finishedAt = null;
  let timeTaken = 0;

  if (validResponses.length > 0) {
    const sortedResponses = validResponses.sort(
      (a, b) => new Date(a.answeredAt) - new Date(b.answeredAt)
    );

    startedAt = sortedResponses[0].answeredAt;
    finishedAt = sortedResponses[sortedResponses.length - 1].answeredAt;

    timeTaken = Math.floor(
      (new Date(finishedAt) - new Date(startedAt)) / 1000
    );
  }

  // Score
  const totalScore = responses.reduce(
    (score, response) => score + (response.pointsAwarded || 0), 
    0
  );
  debug(`Total score calculated for player ID ${playerId}:`, totalScore);

  const quizSnapshot = {
    originalQuizId: quiz._id,
    title: quiz.title,
    description: quiz.description,
    difficulty: quiz.difficulty
  };
  debug(`Quiz snapshot created for player ID ${playerId}:`, quizSnapshot);

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
      quizSnapshot: quizSnapshot,
      timeTaken,
      startedAt,
      finishedAt
  });

  debug(`Saving result for player ID ${playerId} and session ID ${sessionId}:`, result);

  await result.save();

  debug(`Result generated and saved for player ID ${playerId} and session ID ${sessionId}:`, result);
  return result;
}

// Service to calculate ranks for a session (called after generating results when a session is completed in sessionServices)
const calculateRanks = async (sessionId) => {
  debug(`Calculating ranks for session ID ${sessionId}`);

  const results = await Result.find({ sessionId }).sort({ totalScore: -1, timeTaken: 1 });
  debug(`Results fetched for session ID ${sessionId}:`, results);

  const bulkOps = results.map((result, index) => ({
    updateOne: {
      filter: { _id: result._id },
      update: { rank: index + 1 }
    }
  }));
  debug(`Bulk operations for rank updates for session ID ${sessionId}:`, bulkOps);

  await Result.bulkWrite(bulkOps); // Update ranks in a single operation 

  debug(`Ranks updated for session ID ${sessionId}`);
  return results;
}

// Export result services
module.exports = {
  generateResults,
  calculateRanks
};