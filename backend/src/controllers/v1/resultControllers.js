// Import services
const resultServices = require('../../services/v1/resultServices');

// Result controllers
// Controller to get all results
const getAllResults = async (req, res) => {
  try {
    const results = await resultServices.getAllResults();
    res.status(200).json({
        message: 'Results fetched successfully',
        data: results
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching results', 
        error: error.message 
    });
  }
};

// Controller to get a result by ID
const getResultById = async (req, res) => {
  const {id} = req.params;

  if(!id) return res.status(400).json({ message: 'Result ID is required' });
      
      try{
          const result = await resultServices.getResultById(id);
  
          if (!result) return res.status(404).json({ message: 'Result not found' });
          
          res.status(200).json({
              message: 'result fetched successfully', 
              data: result
          });
      } catch (error){
          res.status(500).json({ 
              message: 'Error fetching result', 
              error: error.message 
          });
      }
}

// Export result controllers
module.exports = {
  getAllResults,
  getResultById
};