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

// Export response services
module.exports = {
  getAllResponses,
  getResponseById
};