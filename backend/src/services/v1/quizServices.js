// Import models
const Quiz = require('../../models/Quiz');
const Question = require('../../models/Question');
const Clicker = require('../../models/Clicker');
const Session = require('../../models/Session');
const Result = require('../../models/Result');
const Response = require('../../models/Response');

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

// Service to fetch all quizzes assigned to a specific student
const getAllQuizzesForStudent = async (playerId) => {
    const clicker = await Clicker.findOne({ assignedToUserId: playerId });
    if (!clicker) throw new Error("Student doesn't have an assigned clicker"); // If the student doesn't have an assigned clicker, return an empty array
    
    // Get sessions for the student's clicker, and populate quiz details
    const sessions = await Session.find({ deviceIds: { $in: [clicker._id] } }).populate({
        path: 'quizId',
        populate: [
            { path: 'creatorId', select: 'username role' },
            { path: 'questionIds' }
        ]
    }).sort({ endTime: -1, startTime: -1 }); 

    // Case without sessions
    if (sessions.length === 0) return null;

    // Get results and responses for the sessions
    const sessionIds = sessions.map(s => s._id);

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId });
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();
    
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();
    
    responses.forEach(r => {
        const key = r.sessionId.toString();
        if (!responsesMap.has(key)) {
            responsesMap.set(key, []);
        }
        responsesMap.get(key).push(r);
    });

    // Normalize sessions data to include quiz details and group by quiz
    const formattedSessions = sessions.map(session => ({
        _id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        totalTime: session.endTime && session.startTime 
            ? (session.endTime - session.startTime) 
            : null,
        status: session.status,
        results: resultsMap.get(session._id.toString()) || null,
        responses: responsesMap.get(session._id.toString()) || [],
        quiz: session.quizId
    }));

    // Group sessions by quiz, so we can show all sessions for the same quiz together
    const quizzesMap = new Map();

    formattedSessions.forEach(session => {
        const quizId = session.quiz._id.toString();

        if (!quizzesMap.has(quizId)) {
            quizzesMap.set(quizId, {
                ...session.quiz.toObject(),
                sessions: [session] 
            });
        } else {
            quizzesMap.get(quizId).sessions.push(session);
        }
    });

    return Array.from(quizzesMap.values());
};

// Service to fetch a quiz by ID for a specific student
const getQuizByIdForStudent = async (playerId, quizId) => {
    const clicker = await Clicker.findOne({ assignedToUserId: playerId });
    if (!clicker) throw new Error("Student doesn't have an assigned clicker"); // If the student doesn't have an assigned clicker, we cannot fetch sessions, so we return null

    const sessions = await Session.find({
        quizId: quizId,
        deviceIds: { $in: [clicker._id] }
    })
    .populate({
        path: "quizId",
        populate: [
            { path: "creatorId", select: "username role" },
            { path: "questionIds" }
        ]
    })
    .sort({ endTime: -1, startTime: -1 });

    // Case without sessions
    if (sessions.length === 0) return null;

    // Get results and responses for the sessions
    const sessionIds = sessions.map(s => s._id);

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId });
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();
    
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();
    
    responses.forEach(r => {
        const key = r.sessionId.toString();
        if (!responsesMap.has(key)) {
            responsesMap.set(key, []);
        }
        responsesMap.get(key).push(r);
    });

    // The quiz details will be the same for all sessions, so we can take it from the first session
    const quiz = sessions[0].quizId;

    // Normalize sessions data to include quiz details and group by quiz
    const formattedSessions = sessions.map(session => ({
        _id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        totalTime: session.startTime && session.endTime
            ? session.endTime - session.startTime
            : null,
        status: session.status,
        results: resultsMap.get(session._id.toString()) || null,
        responses: responsesMap.get(session._id.toString()) || []
    }));

    return {
        ...quiz.toObject(),
        sessions: formattedSessions
    };
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
        // const quizData = { ...quizFields, questionIds: finalQuestionIds };

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
    getQuizByIdForStudent,
    getAllQuizzesForTeacher,    
    getAllQuizzesForStudent,

    createQuiz,

    restoreQuizById,
    publishQuizById,
    updateQuizById,

    deleteQuizById,
};