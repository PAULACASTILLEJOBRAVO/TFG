// Import services
const difficultyServices = require('../../services/v1/difficultyServices');

// difficulty controllers
// Controller to fetch all difficulties
const getAllDifficulties = async (req, res) => {
    try {
        const difficulties = await difficultyServices.getAllDifficulties();

        res.status(200).json({
            message: 'Difficulties fetched successfully', 
            data: difficulties
        });
    } catch (error) {
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