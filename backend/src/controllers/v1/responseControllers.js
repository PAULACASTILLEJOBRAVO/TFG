// Import services
const responseService = require('../../services/v1/responseServices');

// Response controllers
// Controller to get all responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await responseService.getAllResponses();
    res.status(200).json({
        message: 'Responses fetched successfully',
        responses: responses
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching quizzes', 
        error: error.message 
    });
  }
};

// Export response controllers
module.exports = {
  getAllResponses,
};