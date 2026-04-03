// Import models
const Quiz = require('../../models/Quiz');
const Question = require('../../models/Question');

// Quiz services
// Service to fetch all quizzes
const getAllQuizzes = async () => {
    return await Quiz.find().populate('creatorId').populate('playerIds').populate('questionIds');
};

// Service to fetch a quiz by ID
const getQuizById = async (id) => {
    return await Quiz.findById(id).populate('creatorId').populate('playerIds').populate('questionIds');
}

// Service to fetch all quizzes created by a specific teacher
const getAllQuizzesForTeacher = async (creatorId) => {
    return await Quiz.find({ creatorId: creatorId }).populate('creatorId').populate('playerIds').populate('questionIds').sort({ status: -1, updatedAt: -1 });
};

// Service to create a new user
const createQuiz = async (body) => {
    const { questions, quizFields } = body;

    // Create a transaction to ensure atomicity
    const session = await Quiz.startSession();
    session.startTransaction();

    try{
        // First, create questions and get their IDs
        const createdQuestions = await Question.insertMany(questions, { session });

        const questionIds = createdQuestions.map(q => q._id);

        // Then, create the quiz with the question IDs
        const quizData = { ...quizFields, questionIds: questionIds };

        // Finnaly, create the quiz
        const createdQuiz = await Quiz.create([quizData], { session });
        
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

// Service to restore a quiz by ID
const restoreQuizById =  async (id) => {
    try {
        const quiz = await getQuizById(id);
        if(!quiz) return false;

        await Quiz.restoreById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to publish a quiz by ID
const publishQuizById =  async (id) => {
    try {
        const quiz = await getQuizById(id);
        if(!quiz) return false;

        await Quiz.publishById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to update an quiz by ID
const updateQuizById = async ({id, body, _id, role}) => {
    const { quizFields } = body;

    // Create a transaction to ensure atomicity
    const session = await Quiz.startSession();
    session.startTransaction();

    try{
        const quiz = await Quiz.findById(id).session(session);
        if(!quiz) throw new Error("Quiz not found");

        // Extract quesions
        const incomingQuestions = body.questions || [];

        // Process incoming questions: determine which are new and which are existing
        const questionsToUpdate = incomingQuestions.filter(q => q._id);
        const questionsToCreate = incomingQuestions.filter(q => !q._id);

        // Update existing questions
        for (const question of questionsToUpdate) {
            await Question.findByIdAndUpdate(
                question._id,
                question,
                { session }
            );
        }

        // Create new questions and get their IDs
        let createdQuestions = [];

        if (questionsToCreate.length > 0) {
            createdQuestions = await Question.insertMany(questionsToCreate, { session });
        }

        // Combine updated and new question IDs for the quiz
        const updatedQuestionIds = questionsToUpdate.map(q => q._id);
        const newQuestionIds = createdQuestions.map(q => q._id);
        const finalQuestionIds = [...updatedQuestionIds, ...newQuestionIds];


        // Then, create the quiz with the question IDs
        const quizData = { ...quizFields, questionIds: finalQuestionIds };

        // Detect deleted questions
        const currentQuestionIds = quiz.questionIds.map(id => id.toString());
        const incomingQuestionIds = finalQuestionIds.map(id => id.toString());
        const questionsToDelete = currentQuestionIds.filter(
            id => !incomingQuestionIds.includes(id)
        );

        // Delete questions
        if (questionsToDelete.length > 0) {
            await Question.deleteMany(
                { _id: { $in: questionsToDelete } },
                { session }
            );
        }

        // Finnaly, update the quiz by id
        const updatedQuiz = await Quiz.updateById(id, {...quizFields, questionIds: finalQuestionIds}, { _id, role }, session);

        await session.commitTransaction();
        session.endSession();

        return updatedQuiz;
    }catch(error){
        await session.abortTransaction();
        session.endSession();

        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllQuizzes,
    getQuizById,
    getAllQuizzesForTeacher,    

    createQuiz,

    restoreQuizById,
    publishQuizById,
    updateQuizById,

    deleteQuizById,
};