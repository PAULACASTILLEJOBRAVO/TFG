// Import models
const Response = require('../../models/Response');

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
    try{
        return await Response.create(body);
    } catch(error){
        throw error.message;
    }
}

// Service to delete a response by ID
const deleteResponseById = async (id) => {
    try {
        const response = await getResponseById(id);
        if (!response) return false; // If the response doesn't exist, return false

        await Response.findByIdAndDelete(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export response services
module.exports = {
  getAllResponses,
  getResponseById,

  createResponse,

  deleteResponseById,
};