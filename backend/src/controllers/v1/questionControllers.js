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

// Controller to create a new question
const createQuestion = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid question data. Body is required' });

    try{
        const newQuestion = await questionServices.createQuestion(body);

        res.status(201).json({
            message: 'Question created successfully', 
            data: newQuestion
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating question', 
            error: error.message 
        });
    }
}

// Controller to delete a question by ID
const deleteQuestionById = async (req, res) => {
    const {id} = req.params;
    const { by, reason } = req.body;

    if(!id) return res.status(400).json({ message: 'Question ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await questionServices.deleteQuestionById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'Question not found' });

        res.status(200).json({
         message: 'Question deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting question',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllQuestions,
    getQuestionById,

    createQuestion,

    deleteQuestionById,
};