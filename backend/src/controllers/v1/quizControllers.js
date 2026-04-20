// Import models
const Quiz = require('../../models/Quiz');

// Import services
const quizServices = require('../../services/v1/quizServices');

// Debug
const debug = require('debug')('backend:controllers:v1:quizControllers');

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

// Controller to fetch a quiz by ID for a specific student
const getQuizByIdForStudent = async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Quiz ID is required' });
    }

    const currentUser = req.user;

    let playerId = currentUser._id;

    if (currentUser.role === "teacher" && studentId) {
        playerId = studentId;
    }

    try {
        const quiz = await quizServices.getQuizByIdForStudent(playerId, id);

        res.status(200).json({
            message: 'Quiz fetched successfully', 
            data: quiz
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching the quiz', 
            error: error.message 
        });
    }
};

// Controller to get all quizzes created by a specific teacher
const getAllQuizzesForTeacher = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;

    const currentUser = req.user;

    try {
        const canAccess = await Quiz.canGetTeacherQuizzes(currentUser);
        if (!canAccess) return res.status(403).json({message: "Unauthorized"});

        const quizzes = await quizServices.getAllQuizzesForTeacher(currentUser._id, limit);
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

// Controller to get all quizzes assigned to a specific student
const getAllQuizzesForStudent = async (req, res) => {
    const limit = parseInt(req.query.limit) || 0;

    const currentUser = req.user;

    try {
        const quizzes = await quizServices.getAllQuizzesForStudent(currentUser._id, limit);
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

// Controller to fetch the sessions and results of a quiz for a specific teacher, to show quiz statistics and students' performance in the quiz sessions
const getQuizSessionsForTeacher = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Quiz ID is required' });

    try {
        const canAccess = await Quiz.canGetTeacherQuizzes(currentUser);
        if (!canAccess) return res.status(403).json({message: "Unauthorized"});

        const sessionsData = await quizServices.getQuizSessionsForTeacher(id);
        res.status(200).json({
            message: 'Quiz sessions fetched successfully', 
            data: sessionsData
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching quiz sessions', 
            error: error.message 
        });
    }
};

// Controller to fetch analytics data for each question of a quiz
const getQuizQuestionAnalytics = async (req, res) => {
    const currentUser = req.user;
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'Quiz ID is required' });

    try {
        debug('Received request to get quiz question analytics with params:', req.params);

        const canAccess = await Quiz.canGetTeacherQuizzes(currentUser);
        if (!canAccess) return res.status(403).json({message: "Unauthorized"});
        
        debug('User is authorized to access quiz question analytics for quiz with ID:', id);
        const analyticsData = await quizServices.getQuizQuestionAnalytics(id);

        debug('Quiz question analytics fetched successfully for quiz with ID:', id, 'Analytics data:', analyticsData);
        res.status(200).json({
            message: 'Quiz question analytics fetched successfully', 
            data: analyticsData
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching quiz question analytics',
            error: error.message
        })
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
    debug('Received request to delete quiz with params:', req.params);
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        debug('Attempting to delete quiz with ID:', id);
        const deleted = await quizServices.deleteQuizById(id);

        if (!deleted) return res.status(404).json({ message: 'Quiz not found' });
        debug('Quiz deleted successfully with ID:', id);

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
    debug('Received request to restore quiz with params:', req.params);
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        debug('Attempting to restore quiz with ID:', id); 
        const restored = await quizServices.restoreQuizById(id);

        if (!restored) return res.status(404).json({ message: 'Quiz not found' });
        debug('Quiz restored successfully with ID:', id);

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
    debug('Received request to publish quiz with params:', req.params);
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});

    try{
        debug('Attempting to publish quiz with ID:', id);
        const published = await quizServices.publishQuizById(id);

        if (!published) return res.status(404).json({ message: 'Quiz not found' });
        debug('Quiz published successfully with ID:', id);

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
    debug('Received request to update quiz with params:', req.params, 'and body:', req.body);

    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!id) return res.status(400).json({ message: 'Quiz ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        debug('Attempting to update quiz with ID:', id, 'and body:', body);
        const updatedQuiz = await quizServices.updateQuizById({id, body, _id, role});

        if(!updatedQuiz) return res.status(404).json({ message: 'Quiz not found'});

        debug('Quiz updated successfully with ID:', id, 'Updated quiz:', updatedQuiz);
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
    getQuizByIdForStudent,
    getAllQuizzesForTeacher,
    getAllQuizzesForStudent,
    getQuizSessionsForTeacher,
    getQuizQuestionAnalytics,

    createQuiz,
    
    restoreQuizById,
    publishQuizById,
    updateQuizById,

    deleteQuizById,
};