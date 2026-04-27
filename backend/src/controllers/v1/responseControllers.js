// Import services
const responseServices = require('../../services/v1/responseServices');

// Debug
const debug = require('debug')('backend:controllers:v1:responseControllers');

// Response controllers
// Controller to create a new response
const createResponse = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid response data. Body is required' });

    try{
        debug('Creating response with data:', body);
        const newResponse = await responseServices.createResponse(body);

        debug('Response created successfully:', newResponse);
        res.status(201).json({
            message: 'Response created successfully', 
            data: newResponse
        });    
    } catch(error){
        debug('Error creating response:', error);
        res.status(500).json({ 
            message: 'Error creating response', 
            error: error.message 
        });
    }
}

// Export response controllers
module.exports = {
  createResponse,
};