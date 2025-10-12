// Import models
const Result = require('../../models/Result');

// Result services
// Service to get all results
const getAllResults = async () => {
  return await Result.find().populate('playerId').populate('quizId');
};

// Export result services
module.exports = {
  getAllResults,
};