// Import services
const resultService = require('../../services/v1/resultServices');

// Result controllers
// Controller to get all results
const getAllResults = async (req, res) => {
  try {
    const results = await resultService.getAllResults();
    res.status(200).json({
        message: 'Results fetched successfully',
        results: results
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching results', 
        error: error.message 
    });
  }
};

// Export result controllers
module.exports = {
  getAllResults,
};