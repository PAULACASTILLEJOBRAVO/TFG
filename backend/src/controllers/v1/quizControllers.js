// Import services
const quizServices = require('../../services/v1/quizServices');

// Quiz controllers
// Controller to get all quizzes
const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await quizServices.getAllQuizzes();
        res.status(200).json({
            message: 'Quizzes fetched successfully', 
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching quizzes', 
            error: error.message 
        });
    }
};

// Controller to get a quiz by ID
const getQuizById = async (req, res) => {
    const {id} = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required' });
    
    try{
        const quiz = await quizServices.getQuizById(id);

        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        
        res.status(200).json({
            message: 'Quiz fetched successfully', 
            data: quiz
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching quiz', 
            error: error.message 
        });
    }
}

// Controller to create a new quiz
const createQuiz = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid quiz data. Body is required' });

    try{
        const newQuiz = await quizServices.createQuiz(body);

        res.status(201).json({
            message: 'Quiz created successfully', 
            data: newQuiz
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating quiz', 
            error: error.message 
        });
    }
}

// Controller to delete a quiz by ID
const deleteQuizById = async (req, res) => {
    const {id} = req.params;
    const { by, reason } = req.body;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await quizServices.deleteQuizById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'Quiz not found' });

        res.status(200).json({
         message: 'Quiz deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting quiz',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllQuizzes,
    getQuizById,

    createQuiz,
    
    deleteQuizById,
};