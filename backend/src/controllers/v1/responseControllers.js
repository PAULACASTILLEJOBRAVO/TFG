// Import services
const responseServices = require('../../services/v1/responseServices');

// Response controllers
// Controller to get all responses
const getAllResponses = async (req, res) => {
  try {
    const responses = await responseServices.getAllResponses();
    res.status(200).json({
        message: 'Responses fetched successfully',
        data: responses
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching quizzes', 
        error: error.message 
    });
  }
};

// Controller to get a response by ID
const getResponseById = async (req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ message: 'Response ID is required' });
      
      try{
          const response = await responseServices.getResponseById(id);
  
          if (!response) return res.status(404).json({ message: 'Response not found' });
          
          res.status(200).json({
              message: 'Response fetched successfully', 
              data: response
          });
      } catch (error){
          res.status(500).json({ 
              message: 'Error fetching response', 
              error: error.message 
          });
      }
}

// Controller to create a new response
const createResponse = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid response data. Body is required' });

    try{
        const newResponse = await responseServices.createResponse(body);

        res.status(201).json({
            message: 'Response created successfully', 
            data: newResponse
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating response', 
            error: error.message 
        });
    }
}

// Export response controllers
module.exports = {
  getAllResponses,
  getResponseById,

  createResponse
};