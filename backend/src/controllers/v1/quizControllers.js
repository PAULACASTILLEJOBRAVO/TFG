// Import models
const Quiz = require('../../models/Quiz');

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

// Controller to get all quizzes created by a specific teacher
const getAllQuizzesForTeacher = async (req, res) => {

    const currentUser = req.user;

    try {
        const canAccess = await Quiz.canGetTeacherQuizzes(currentUser);
        if (!canAccess) return res.status(403).json({message: "Unauthorized"});

        const quizzes = await quizServices.getAllQuizzesForTeacher(currentUser._id);
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

// Controller to get all quizzes created by a specific teacher
const getAllQuizzesForStudent = async (req, res) => {
    const currentUser = req.user;

    try {
        const quizzes = await quizServices.getAllQuizzesForStudent(currentUser._id);
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
    const { id } = req.params;
    const { reason } = req.body;
    const {_id } = req.user;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        const deleted = await quizServices.deleteQuizById(id, _id, reason);

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

// Controller to restore a quiz by ID
const restoreQuizById = async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        const restored = await quizServices.restoreQuizById(id);

        if (!restored) return res.status(404).json({ message: 'Quiz not found' });

        res.status(200).json({
         message: 'Quiz restored successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error restoring quiz',
            error: error.message
        })
    }
}

const publishQuizById = async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        const published = await quizServices.publishQuizById(id);

        if (!published) return res.status(404).json({ message: 'Quiz not found' });

        res.status(200).json({
         message: 'Quiz published successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error publishing quiz',
            error: error.message
        })
    }
}

// Controller to update a quiz by ID
const updateQuizById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        const updatedQuiz = await quizServices.updateQuizById({id, body, _id, role});

        if(!updatedQuiz) return res.status(404).json({ message: 'Quiz not found'});

        res.status(200).json({
            message: 'Quiz updated successfully',
            data: updatedQuiz
        })
    }catch(error){
        res.status(500).json({
            message: 'Error updating quiz',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllQuizzes,
    getQuizById,
    getAllQuizzesForTeacher,
    getAllQuizzesForStudent,

    createQuiz,
    
    restoreQuizById,
    publishQuizById,
    updateQuizById,

    deleteQuizById,
};