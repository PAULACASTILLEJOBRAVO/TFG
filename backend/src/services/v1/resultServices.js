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

// Service to delete a result by ID
const deleteResultById = async (id) => {
    try {
        const result = await getResultById(id);
        if (!result) return false; // If the user doesn't exist, return false

        await Result.findByIdAndDelete(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export result services
module.exports = {
  getAllResults,
  getResultById,

  createResult,

  deleteResultById,
};