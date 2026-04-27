// Import services
const resultServices = require('../../services/v1/resultServices');

// Result controllers
// Controller to create a new result
const createResult = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Body is required' });

    try{
        const newResult = await resultServices.createResult(body);

        res.status(201).json({
            message: 'Result created successfully', 
            data: newResult
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating result', 
            error: error.message 
        });
    }
}

// Export result controllers
module.exports = {
  createResult,
};