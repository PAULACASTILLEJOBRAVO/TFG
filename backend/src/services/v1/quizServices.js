// Import models
const Quiz = require('../../models/Quiz');
const Question = require('../../models/Question');
const Clicker = require('../../models/Clicker');
const Session = require('../../models/Session');
const Result = require('../../models/Result');
const Response = require('../../models/Response');

// Import utils
const { addOptionLetters } = require("../../utils/questionUtils");

// Debug
const debug = require('debug')('backend:services:v1:quizServices');

// Quiz services
// Service to fetch all quizzes
const getAllQuizzes = async () => {
    debug('Fetching all quizzes from the database');
    return await Quiz.find().populate('creatorId').populate('playerIds').populate('questionIds');
};

// Service to fetch a quiz by ID
const getQuizById = async (id) => {
    debug(`Fetching quiz with ID: ${id}`);
    return await Quiz.findById(id).populate('creatorId').populate('playerIds').populate('questionIds');
}

// Service to fetch all quizzes created by a specific teacher
const getAllQuizzesForTeacher = async (creatorId) => {
    debug(`Fetching quizzes for teacher with ID: ${creatorId}`);
    return await Quiz.find({ creatorId: creatorId }).populate('creatorId').populate('playerIds').populate('questionIds').sort({ status: -1, updatedAt: -1 });
};

// Service to fetch all quizzes assigned to a specific student
const getAllQuizzesForStudent = async (playerId) => {
    debug(`Fetching quizzes for student with ID: ${playerId}`);
    const clicker = await Clicker.findOne({ assignedToUserId: playerId });
    if (!clicker) throw new Error("Student doesn't have an assigned clicker"); // If the student doesn't have an assigned clicker, return an empty array
    
    // Get sessions for the student's clicker, and populate quiz details
    debug(`Found clicker with ID: ${clicker._id} for student with ID: ${playerId}`);
    const sessions = await Session.find({ deviceIds: { $in: [clicker._id] } }).sort({ endTime: -1, startTime: -1 }); 
    debug('Found sessions for student quizzes');

    // Case without sessions
    if (sessions.length === 0) return null;

    // Get results and responses for the sessions
    const sessionIds = sessions.map(s => s._id);

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId });
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();

    debug('Mapping results to sessions for student quizzes');
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();

    debug('Mapping responses to sessions for student quizzes');
    responses.forEach(r => {
        const key = r.sessionId.toString();
        if (!responsesMap.has(key)) {
            responsesMap.set(key, []);
        }
        responsesMap.get(key).push(r);
    });

    // Group sessions by quiz, so we can show all sessions for the same quiz together
    const quizzesMap = new Map();

    results.forEach(result => {
        const quizId = result.quizSnapshot.originalQuizId.toString();

        if (!quizzesMap.has(quizId)) {
            quizzesMap.set(quizId, {
                _id: result.quizSnapshot.originalQuizId,
                title: result.quizSnapshot.title,
                description: result.quizSnapshot.description,
                difficulty: result.quizSnapshot.difficulty,
                sessions: []
            });
        }
    });

    sessions.forEach(session => {
        const result = resultsMap.get(session._id.toString());
        if (!result) return;

        const quizId = result.quizSnapshot.originalQuizId.toString();

        const group = quizzesMap.get(quizId);
        if (!group) return;

        group.sessions.push({
            _id: session._id,
            startTime: session.startTime,
            endTime: session.endTime,
            totalTime: session.endTime && session.startTime
                ? (session.endTime - session.startTime)
                : null,
            status: session.status,
            questions: session.questions,
            results: result,
            responses: responsesMap.get(session._id.toString()) || []
        });
    });

    return Array.from(quizzesMap.values());
};

// Service to fetch a quiz by ID for a specific student
const getQuizByIdForStudent = async (playerId, quizId) => {
    debug(`Fetching quiz with ID: ${quizId} for student with ID: ${playerId}`);

    const clicker = await Clicker.findOne({ assignedToUserId: playerId });
    if (!clicker) throw new Error("Student doesn't have an assigned clicker"); // If the student doesn't have an assigned clicker, we cannot fetch sessions, so we return null
    debug(`Found clicker with ID: ${clicker._id} for student with ID: ${playerId}`);

    const sessions = await Session.find({
        quizId: quizId,
        deviceIds: { $in: [clicker._id] }
    }).sort({ endTime: -1, startTime: -1 });
    debug(`Found sessions for quiz with ID: ${quizId} and student with ID: ${playerId}`);

    // Case without sessions
    if (sessions.length === 0) return null;

    // Get results and responses for the sessions
    const sessionIds = sessions.map(s => s._id);

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId });
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();
    
    debug('Mapping results to sessions for quiz with ID: ${quizId} and student with ID: ${playerId}');
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();
    
    debug('Mapping responses to sessions for quiz with ID: ${quizId} and student with ID: ${playerId}');
    responses.forEach(r => {
        const key = r.sessionId.toString();
        if (!responsesMap.has(key)) {
            responsesMap.set(key, []);
        }
        responsesMap.get(key).push(r);
    });

    // Get quiz details from the first result (all results should have the same quiz details since they belong to the same quiz)
    const result = results.find(r =>
        r.quizSnapshot.originalQuizId.toString() === quizId
    );

    if (!result) return null;

    const quiz = {
        _id: result.quizSnapshot.originalQuizId,
        title: result.quizSnapshot.title,
        description: result.quizSnapshot.description,
        difficulty: result.quizSnapshot.difficulty
    };

    debug(`Formatting sessions with results and responses for quiz with ID: ${quizId} and student with ID: ${playerId}`);
    // Format sessions to include results and responses
    const formattedSessions = sessions.map(session => ({
        _id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        totalTime: session.startTime && session.endTime
            ? session.endTime - session.startTime
            : null,
        status: session.status,
        questions: session.questions,
        results: resultsMap.get(session._id.toString()) || null,
        responses: responsesMap.get(session._id.toString()) || []
    }));

    return {
        ...quiz,
        sessions: formattedSessions
    };
};

// Service to create a new user
const createQuiz = async (body) => {
    debug('Creating a new quiz with body:', body);
    const { questions, quizFields } = body;

    // Create a transaction to ensure atomicity
    const session = await Quiz.startSession();
    session.startTransaction();

    debug('Transaction started for creating a new quiz');
    try{
        // First, add letters to options and set quizId for each question
        const questionsWithDetails = addOptionLetters(questions);

        // First, create questions and get their IDs
        const createdQuestions = await Question.insertMany(questionsWithDetails, { session });
        debug('Created questions for new quiz:', createdQuestions);

        const questionIds = createdQuestions.map(q => q._id);

        // Then, create the quiz with the question IDs
        const quizData = { ...quizFields, questionIds: questionIds };
        debug('Quiz data to be created:', quizData);

        // Finnaly, create the quiz
        const createdQuiz = await Quiz.create([quizData], { session });
        debug('Created quiz:', createdQuiz);

        debug('Committing transaction for creating a new quiz');
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
const deleteQuizById = async (id) => {
    try {
        debug('Attempting to delete quiz with ID:', id);
        const quiz = await getQuizById(id);
        if (!quiz) return false; // If the quiz doesn't exist, return false

        debug('Quiz found for deletion:', quiz);
        await Quiz.softDeleteById(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service to restore a quiz by ID
const restoreQuizById =  async (id) => {
    try {
        debug('Attempting to restore quiz with ID:', id);
        const quiz = await getQuizById(id);
        if(!quiz) return false;

        debug('Quiz found for restoration:', quiz);
        await Quiz.restoreById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to publish a quiz by ID
const publishQuizById =  async (id) => {
    try {
        debug('Attempting to publish quiz with ID:', id);
        const quiz = await getQuizById(id);
        if(!quiz) return false;

        debug('Quiz found for publishing:', quiz);
        await Quiz.publishById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to update an quiz by ID
const updateQuizById = async ({id, body, _id, role}) => {
    debug('Attempting to update quiz with ID:', id, 'and body:', body);
    const { quizFields } = body;

    // Create a transaction to ensure atomicity
    const session = await Quiz.startSession();
    session.startTransaction();

    try{
        debug('Transaction started for updating quiz with ID:', id);
        const quiz = await Quiz.findById(id).session(session);
        if(!quiz) throw new Error("Quiz not found");

        // Extract quesions
        const incomingQuestions = body.questions || [];
        debug('Incoming questions for quiz update:', incomingQuestions);

        // Process incoming questions: determine which are new and which are existing
        const questionsToUpdate = incomingQuestions.filter(q => q._id);
        const questionsToCreate = incomingQuestions.filter(q => !q._id);
        debug('Questions to update:', questionsToUpdate);
        debug('Questions to create:', questionsToCreate);

        // Update existing questions
        debug('Updating existing questions for quiz with ID:', id);
        const questionsToUpdateWithLetters = addOptionLetters(questionsToUpdate);

        for (const question of questionsToUpdateWithLetters) {
            await Question.findByIdAndUpdate(
                question._id,
                question,
                { session }
            );
        }

        // Create new questions and get their IDs
        let createdQuestions = [];

        if (questionsToCreate.length > 0) {
            debug('Creating new questions for quiz with ID:', id);

            const questionsWithDetails = addOptionLetters(questionsToCreate);

            createdQuestions = await Question.insertMany(questionsWithDetails, { session });
        }

        // Combine updated and new question IDs for the quiz
        const updatedQuestionIds = questionsToUpdate.map(q => q._id);
        const newQuestionIds = createdQuestions.map(q => q._id);
        const finalQuestionIds = [...updatedQuestionIds, ...newQuestionIds];
        debug('Final question IDs for quiz update:', finalQuestionIds);

        // Detect deleted questions
        const currentQuestionIds = quiz.questionIds.map(id => id.toString());
        const incomingQuestionIds = finalQuestionIds.map(id => id.toString());
        const questionsToDelete = currentQuestionIds.filter(
            id => !incomingQuestionIds.includes(id)
        );
        debug('Questions to delete:', questionsToDelete);

        // Delete questions
        debug('Deleting removed questions for quiz with ID:', id);
        if (questionsToDelete.length > 0) {
            await Question.deleteMany(
                { _id: { $in: questionsToDelete } },
                { session }
            );
        }

        // Finnaly, update the quiz by id
        debug('Updating quiz with ID:', id, 'with fields:', quizFields, 'and question IDs:', finalQuestionIds);
        const updatedQuiz = await Quiz.updateById(id, {...quizFields, questionIds: finalQuestionIds}, { _id, role }, session);

        await session.commitTransaction();
        session.endSession();

        debug('Quiz updated successfully with ID:', id, 'Updated quiz:', updatedQuiz);
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