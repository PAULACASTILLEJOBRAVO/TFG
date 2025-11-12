// Import models
const Result = require('../../models/Result');

// Result services
// Service to get all results
const getAllResults = async () => {
  return await Result.find().populate('playerId').populate('quizId').populate('sessionId');
};

// Service to get a result by ID
const getResultById = async (id) => {
  return await Result.findById(id).populate('playerId').populate('quizId').populate('sessionId');
}

// Service to create a new Result
const createResult = async (body) => {
    try{
        return await Result.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export result services
module.exports = {
  getAllResults,
  getResultById,

  createResult,
};