// Import services
const questionServices = require('../../services/v1/questionServices');

// Question controllers
// Controller to get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await questionServices.getAllQuestions();
        res.status(200).json({
            message: 'Questions fetched successful', 
            questions: questions
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching questions', 
            error: error.message 
        });
    }
};

// Export controllers functions
module.exports = {
    getAllQuestions
};