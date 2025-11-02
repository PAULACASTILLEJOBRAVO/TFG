// Import models
const Quiz = require('../../models/Quiz');

// Quiz services
// Service to fetch all quizzes
const getAllQuizzes = async () => {
    return await Quiz.find().populate('creatorId').populate('courseId').populate('questionIds');
};

// Service to fetch a quiz by ID
const getQuizById = async (id) => {
    return await Quiz.findById(id).populate('creatorId').populate('courseId').populate('questionIds');
}

// Service to create a new user
const createQuiz = async (body) => {
    try{
        return await Quiz.create(body);
    } catch(error){
        throw error.message;
    }
}


// Service to delete an user by ID
const deleteQuizById = async (id) => {
    try {
        const quiz = await getQuizById(id);
        if (!quiz) return false; // If the quiz doesn't exist, return false

        await Quiz.findByIdAndDelete(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllQuizzes,
    getQuizById,

    createQuiz,

    deleteQuizById,
};