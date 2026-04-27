// Import services
const difficultyServices = require('../../services/v1/difficultyServices');

// Debug
const debug = require('debug')('backend:controllers:v1:difficultyControllers');

// difficulty controllers
// Controller to fetch all difficulties
const getAllDifficulties = async (req, res) => {
    try {
        debug('Fetching all difficulties');
        const difficulties = await difficultyServices.getAllDifficulties();

        debug('Difficulties fetched successfully:', difficulties);
        res.status(200).json({
            message: 'Difficulties fetched successfully', 
            data: difficulties
        });
    } catch (error) {
        debug('Error fetching difficulties:', error);
        res.status(500).json({ 
            message: 'Error fetching difficulties', 
            error: error.message 
        });
    }
}

// Export controller functions
module.exports = {
    getAllDifficulties
}