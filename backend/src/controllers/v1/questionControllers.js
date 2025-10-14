// Import services
const questionServices = require('../../services/v1/questionServices');

// Question controllers
// Controller to get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await questionServices.getAllQuestions();
        res.status(200).json({
            message: 'Questions fetched successful', 
            data: questions
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching questions', 
            error: error.message 
        });
    }
};

// Controller to get a question by ID
const getQuestionById = async (req, res) => {
    const {id} = req.params;

    if(!id) return res.status(400).json({ message: 'Question ID is required' });
    
    try{
        const question = await questionServices.getQuestionById(id);

        if (!question) return res.status(404).json({ message: 'Question not found' });
        
        res.status(200).json({
            message: 'Question fetched successfully', 
            data: question
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching question', 
            error: error.message 
        });
    }
}

// Export controllers functions
module.exports = {
    getAllQuestions,
    getQuestionById
};