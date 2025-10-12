// Import services
const quizServices = require('../../services/v1/quizServices');

// Quiz controllers
// Controller to get all quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizServices.getAllQuizzes();
        res.status(200).json({
            message: 'Quizzes fetched successful', 
            quizzes: quizzes
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching quizzes', 
            error: error.message 
        });
    }
};

// Export controllers functions
module.exports = {
    getAllQuizzes
};