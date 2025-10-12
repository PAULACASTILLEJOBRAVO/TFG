// Import models
const Response = require('../../models/Response');

// Response services
// Service to get all responses
const getAllResponses = async () => {
  return await Response.find().populate('playerId').populate('questionId');
};

// Export response services
module.exports = {
  getAllResponses,
};