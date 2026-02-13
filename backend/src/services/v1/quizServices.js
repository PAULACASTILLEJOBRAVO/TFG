// Import models
const Quiz = require('../../models/Quiz');
const Question = require('../../models/Question');

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
    const { questions, quizFields } = body;
    console.log('Received body:', body);

        // Create a transaction to ensure atomicity
        const session = await Quiz.startSession();
        session.startTransaction();

    try{
        // First, create questions and get their IDs
        const createdQuestions = await Question.insertMany(questions, { session });

        const questionIds = createdQuestions.map(q => q._id);

        // Then, create the quiz with the question IDs
        const quizData = { ...quizFields, questionIds: questionIds };
        console.log('Quiz fields:', quizFields);
        console.log('Created questions with IDs:', questionIds);
        console.log('Creating quiz with data:', quizData);

        // Finnaly, create the quiz
        const createdQuiz = await Quiz.create([quizData], { session });
        console.log('Created quiz:', createdQuiz);
        
        await session.commitTransaction();
        session.endSession();

        return createdQuiz[0]; // insertMany returns an array of created documents
    } catch(error){
        await session.abortTransaction();
        session.endSession();

        throw error.message;
    }
}


// Service to delete an user by ID
const deleteQuizById = async (id, by = null, reason = 'Quiz deleted via service') => {
    try {
        const quiz = await getQuizById(id);
        if (!quiz) return false; // If the quiz doesn't exist, return false

        await Quiz.softDeleteById(id, { by, reason });
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