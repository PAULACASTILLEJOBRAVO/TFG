// Import models
const User = require('../../models/User');
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
const getAllQuizzesForTeacher = async (creatorId, limit) => {
    debug(`Fetching quizzes for teacher with ID: ${creatorId}`);
    // Fetch quizzes created by the teacher, and populate necessary fields
    const quizzes = await Quiz.find({ creatorId: creatorId }).populate('creatorId').populate('playerIds').populate('questionIds').sort({ status: -1, updatedAt: -1 }).limit(limit);
    debug(`Fetched ${quizzes.length} quizzes for teacher with ID: ${creatorId}`);

    // Extract quiz IDs for further processing if needed
    const quizIds = quizzes.map(q => q._id);
    debug('Quiz IDs fetched for teacher:', quizIds);

    // Get sessions count and last session time for each quiz using aggregation
    const sessionsCount = await Session.aggregate([
        {
            $match: {
                quizId: { $in: quizIds }
            }
        },
        {
            $group: {
                _id: "$quizId",
                count: { $sum: 1 },
                lastSession: { $max: "$endTime" }
            }
        }
    ]);
    debug('Sessions count and last session time fetched for quizzes:', sessionsCount);

    // Create a map of quizId to sessions count and last session time for easy access
    const sessionsMap = new Map();

    sessionsCount.forEach(s => {
        sessionsMap.set(s._id.toString(), {
            count: s.count,
            lastSession: s.lastSession
        });
    });
    debug('Sessions map created for quizzes:', sessionsMap);
    
    // Enrich quizzes with sessions count and last session time
    const enrichedQuizzes = quizzes.map(q => {
        const data = sessionsMap.get(q._id.toString());

        return {
            ...q.toObject(),
            sessionsCount: data?.count || 0,
            hasSessions: (data?.count || 0) > 0,
            lastSession: data?.lastSession || null
        };
    });
    debug('Enriched quizzes with sessions count and last session time:', enrichedQuizzes);

    return enrichedQuizzes;
};

// Service to fetch the sessions and results of a quiz for a specific teacher, to show quiz statistics and students' performance in the quiz sessions
const getQuizSessionsForTeacher = async (quizId) => {
    debug(`Fetching quiz sessions for quiz with ID: ${quizId}`);
    
    // 1. Obtain all results for the quiz
    const results = await Result.find({
        "quizSnapshot.originalQuizId": quizId // We use quizSnapshot.originalQuizId to get results of all sessions of the quiz, even if the quiz was edited after starting a session. If we used quizId, we would only get results of sessions that were started after the last edit, because quizId changes with each edit. By using quizSnapshot.originalQuizId, we ensure that we get all results for all sessions of the quiz, regardless of edits.
    });
    debug(`Fetched ${results.length} results for quiz with ID: ${quizId}`);

    if (results.length === 0) {
        return {
            quiz: null,
            stats: {
                participants: 0,
                accuracy: 0,
                avgTime: 0,
                sessions: 0
            },
            students: []
        };
    }

    // 2. Obtain unique sessionIds
    const sessionIds = [...new Set(results.map(r => r.sessionId.toString()))];
    debug(`Unique session IDs for quiz ${quizId}:`, sessionIds);

    // 3. Obtain sessions data for the sessionIds
    const sessions = await Session.find({ _id: { $in: sessionIds } });
    debug(`Fetched sessions for quiz ${quizId}:`, sessions.length);

    const sessionsMap = new Map();
    
    sessions.forEach(s => {
        sessionsMap.set(s._id.toString(), s);
    });
    debug(`Sessions map created for quiz ${quizId}:`, sessionsMap);

    // 4. Group results by sessions 
    const sessionsMapFull = new Map();

    results.forEach(r => {
        const sessionId = r.sessionId.toString();

        if (!sessionsMapFull.has(sessionId)) {
            sessionsMapFull.set(sessionId, {
                sessionId,
                correctAnswers: 0,
                totalQuestions: 0,
                startTime: null,
                endTime: null
            });
        }

        const entry = sessionsMapFull.get(sessionId);

        entry.correctAnswers += r.correctAnswers || 0;
        entry.totalQuestions += r.totalQuestions || 0;

        const session = sessionsMap.get(sessionId);

        if (session) {
            entry.startTime = session.startTime;
            entry.endTime = session.endTime;
        }
    });

    // 5. Format sessions data for the graphic
    const formattedSessions = Array.from(sessionsMapFull.values()).map(s => ({
        timestamp: new Date(s.startTime).getTime(),
        label: new Date(s.startTime).toLocaleDateString(),
        accuracy: s.totalQuestions
            ? Math.round((s.correctAnswers / s.totalQuestions) * 100)
            : 0,
        time: s.startTime && s.endTime
            ? Math.round((s.endTime - s.startTime) / 1000)
            : 0
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

    // 6. Group by student 
    const studentsMap = new Map();

    results.forEach(r => {
        const playerId = r.playerId.toString();

        if (!studentsMap.has(playerId)) {
            studentsMap.set(playerId, {
                _id: playerId,
                sessions: 0,
                correctAnswers: 0,
                totalQuestions: 0,
                totalTime: 0,
                lastSession: null
            });
        }

        const student = studentsMap.get(playerId);

        student.sessions += 1;
        student.correctAnswers += r.correctAnswers || 0;
        student.totalQuestions += r.totalQuestions || 0;

        const session = sessionsMap.get(r.sessionId.toString());

        if (session && session.startTime && session.endTime) {
            const duration = session.endTime - session.startTime;

            student.totalTime += duration;

            if (!student.lastSession || session.endTime > student.lastSession) {
                student.lastSession = session.endTime;
            }
        }
    });
    debug(`Processed results for quiz ${quizId}:`, studentsMap.size);

    // Get user details for the students
    const userIds = Array.from(studentsMap.keys());
    
    const users = await User.find({ _id: { $in: userIds } }).select("username fullname email");

    const usersMap = new Map();
    users.forEach(u => {
        usersMap.set(u._id.toString(), u);
    });

    debug(`Users fetched for quiz ${quizId}:`, users.length);

    // 9. Format students data
    const students = Array.from(studentsMap.values()).map(s => {
        const user = usersMap.get(s._id);

        return {
            _id: s._id,
            name: (user?.fullname ? user?.fullname : user?.username) || "Unknown",
            email: user?.email || "Unknown",
            correctAnswers: s.correctAnswers,
            sessionsCount: s.sessions,
            accuracy: s.totalQuestions ? Math.round((s.correctAnswers / s.totalQuestions) * 100) : 0,
            avgTime: s.sessions ? Math.round(s.totalTime / s.sessions) : 0,
            totalTime: s.totalTime,
            lastSession: s.lastSession
        };
    });
    debug(`Formatted students data for quiz ${quizId}:`, students);

    // 8. Global stats
    const totalParticipants = students.length;

    const totalCorrect = results.reduce((acc, r) => acc + (r.correctAnswers || 0), 0);
    const totalQuestions = results.reduce((acc, r) => acc + (r.totalQuestions || 0), 0);

    // Calculate accuracy as a percentage
    const accuracy = totalQuestions
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;
    debug(`Calculated accuracy for quiz ${quizId}:`, accuracy);

    // Average time
    const avgTime =
        sessions.reduce((acc, s) => {
            if (!s.startTime || !s.endTime) return acc;
            return acc + (s.endTime - s.startTime);
        }, 0) / sessions.length;
    debug(`Calculated average time for quiz ${quizId}:`, avgTime);

    students.sort((a, b) => {
        // 1. Sort by number of correct answers
        if (b.correctAnswers !== a.correctAnswers) {
            return b.correctAnswers - a.correctAnswers;
        }

        // 2. If number of correct answers is the same, sort by accuracy
        if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
        }

        // 3. If accuracy is the same, sort by average time
        return a.avgTime - b.avgTime;
    });

    return {
        quiz: {
            _id: quizId,
            title: results[0]?.quizSnapshot?.title || ""
        },
        stats: {
            participants: totalParticipants,
            accuracy,
            avgTime: Math.round(avgTime / 1000),
            sessions: sessions.length // Number of sessions is the length of the sessions array, which we obtained from the database, instead of summing the sessions count from students, to avoid any inconsistency in the data
        },
        students,
        sessions: formattedSessions // Complete sessions data for the graphic
    };
};

// Service to fetch all quizzes assigned to a specific student
const getAllQuizzesForStudent = async (playerId, limit = 0) => {
    debug(`Fetching quizzes for student with ID: ${playerId}`);
    const clicker = await Clicker.findOne({ assignedToUserId: playerId });
    if (!clicker) throw new Error("Student doesn't have an assigned clicker"); // If the student doesn't have an assigned clicker, return an empty array
    
    // Get sessions for the student's clicker, and populate quiz details
    debug(`Found clicker with ID: ${clicker._id} for student with ID: ${playerId}`);
    const sessions = await Session.find({ deviceIds: { $in: [clicker._id] } }).sort({ endTime: -1, startTime: -1 }); 
    debug(`Found ${sessions.length} sessions for student quizzes`);

    // Case without sessions
    if (sessions.length === 0) return null;

    // Get results and responses for the sessions
    const sessionIds = sessions.map(s => s._id);

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId });
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();

    debug(`Mapping ${results.length} results to sessions for student quizzes`);
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();

    debug(`Mapping ${responses.length} responses to sessions for student quizzes`);
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

    const quizLastActivity = new Map();

    sessions.forEach(session => {
        const result = resultsMap.get(session._id.toString());
        if (!result) return;

        const quizId = result.quizSnapshot.originalQuizId.toString();

        const sessionDate = session.endTime || session.startTime;

        const prev = quizLastActivity.get(quizId);

        if (!prev || sessionDate > prev) {
            quizLastActivity.set(quizId, sessionDate);
        }

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

    // Sort quizzes by last session activity
    let quizzes = Array.from(quizzesMap.values());

    quizzes.sort((a, b) => {
        const aTime = quizLastActivity.get(a._id.toString()) || 0;
        const bTime = quizLastActivity.get(b._id.toString()) || 0;

        return bTime - aTime;
    });

    // Apply limit if specified
    if (limit > 0) {
        quizzes = quizzes.slice(0, limit);
    }

    return quizzes;
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

    const results = await Result.find({ sessionId: { $in: sessionIds }, playerId: playerId }).populate('playerId');
    const responses = await Response.find({ sessionId: { $in: sessionIds }, playerId: playerId });

    // Create maps for quick access to results and responses by sessionId
    const resultsMap = new Map();
    
    debug(`Mapping ${results.length} results to sessions for quiz with ID: ${quizId} and student with ID: ${playerId}`);
    results.forEach(r => {
        resultsMap.set(r.sessionId.toString(), r);
    });

    const responsesMap = new Map();
    
    debug(`Mapping ${responses.length} responses to sessions for quiz with ID: ${quizId} and student with ID: ${playerId}`);
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

// Service to fetch the sessions and results of a quiz for a specific teacher, to show quiz statistics and students' performance in the quiz sessions
// const getQuizQuestionAnalytics = async (quizId) => {
//     debug(`Fetching question analytics for quiz with ID: ${quizId}`);

//     // 1. Obtain results (for student performance analysis)
//     const results = await Result.find({
//         "quizSnapshot.originalQuizId": quizId
//     });

//     if (results.length === 0) {
//         return [];
//     }

//     // 2. Map student scores to identify top and bottom performers for the discrimination index calculation
//     const studentScores = results.map(r => ({
//         playerId: r.playerId.toString(),
//         score: r.totalQuestions
//             ? r.correctAnswers / r.totalQuestions
//             : 0
//     }));

//     // Order from highest to lowest score, so we can easily identify top and bottom performers 
//     studentScores.sort((a, b) => b.score - a.score);

//     // 3. Divide students into top 27% and bottom 27% based on their scores, to analyze the discrimination index of each question, which indicates how well a question differentiates between high-performing and low-performing students. We use 27% as a common threshold in psychometrics for this analysis.
//     const groupSize = Math.max(1, Math.floor(studentScores.length * 0.27));

//     const topGroup = new Set(
//         studentScores.slice(0, groupSize).map(s => s.playerId)
//     );

//     const bottomGroup = new Set(
//         studentScores.slice(-groupSize).map(s => s.playerId)
//     );

//     // 4. Obtain responses
//     // const responses = await Response.find({
//     //     quizId // ⚠️ si NO tienes quizId en response, usar sessionId -> luego te explico
//     // });

//     // ⚠️ Si response NO tiene quizId:
//     // tendrás que filtrar por sessionIds del quiz (como ya haces en otras funciones)

//     // 5. Agrupar por pregunta
//     const questionMap = new Map();

//     responses.forEach(r => {
//         const qId = r.questionId.toString();

//         if (!questionMap.has(qId)) {
//             questionMap.set(qId, {
//                 questionId: qId,
//                 total: 0,
//                 correct: 0,
//                 topCorrect: 0,
//                 topTotal: 0,
//                 bottomCorrect: 0,
//                 bottomTotal: 0,
//                 options: {} // para distractores
//             });
//         }

//         const q = questionMap.get(qId);

//         q.total += 1;
//         if (r.isCorrect) q.correct += 1;

//         const playerId = r.playerId.toString();

//         // High group
//         if (topGroup.has(playerId)) {
//             q.topTotal += 1;
//             if (r.isCorrect) q.topCorrect += 1;
//         }

//         // Low group
//         if (bottomGroup.has(playerId)) {
//             q.bottomTotal += 1;
//             if (r.isCorrect) q.bottomCorrect += 1;
//         }

//         // Distractors
//         const option = r.answer;

//         if (!q.options[option]) {
//             q.options[option] = {
//                 count: 0,
//                 top: 0,
//                 bottom: 0
//             };
//         }

//         q.options[option].count += 1;

//         if (topGroup.has(playerId)) {
//             q.options[option].top += 1;
//         }

//         if (bottomGroup.has(playerId)) {
//             q.options[option].bottom += 1;
//         }
//     });

//     // 6. Format results
//     const analytics = Array.from(questionMap.values()).map(q => {
//         const difficulty = q.total
//             ? q.correct / q.total
//             : 0;

//         const pTop = q.topTotal
//             ? q.topCorrect / q.topTotal
//             : 0;

//         const pBottom = q.bottomTotal
//             ? q.bottomCorrect / q.bottomTotal
//             : 0;

//         const discrimination = pTop - pBottom;

//         // Format distractors data
//         const distractors = Object.entries(q.options).map(([letter, data]) => {
//             const pickRate = q.total ? data.count / q.total : 0;

//             let quality = "weak";

//             if (data.bottom > data.top) quality = "good";
//             if (data.top > data.bottom) quality = "confusing";

//             return {
//                 option: letter,
//                 pickRate: Math.round(pickRate * 100),
//                 quality
//             };
//         });

//         return {
//             questionId: q.questionId,
//             difficulty: Math.round(difficulty * 100),
//             discrimination: Number(discrimination.toFixed(2)),
//             distractors
//         };
//     });

//     debug(`Question analytics computed for quiz ${quizId}`);

//     return analytics;
// };
const getQuizQuestionAnalytics = async (quizId) => {
    // 1. Obtain quiz sessions
    const sessions = await Session.find({ quizId });

    if (!sessions.length) return [];

    const sessionIds = sessions.map(s => s._id);

    // 2. Obtain responses for those sessions
    const responses = await Response.find({
        sessionId: { $in: sessionIds }
    });

    // 3. Map questions (from snapshots)
    const questionsMap = new Map();

    sessions.forEach(session => {
        session.questions.forEach(q => {
            const qId = q.originalQuestionId.toString();

            if (!questionsMap.has(qId)) {
                questionsMap.set(qId, {
                    questionId: qId,
                    text: q.questionSnapshot.text,
                    options: q.questionSnapshot.options.map(o => ({
                        letter: o.letter,
                        text: o.text,
                        isCorrect: o.isCorrect,
                        count: 0
                    })),
                    totalResponses: 0,
                    correctResponses: 0
                });
            }
        });
    });

    // 4. Process responses
    responses.forEach(r => {
        const qId = r.questionId.toString();
        const question = questionsMap.get(qId);

        if (!question) return;

        question.totalResponses += 1;

        if (r.isCorrect) {
            question.correctResponses += 1;
        }

        const option = question.options.find(o => o.letter === r.answer);
        if (option) {
            option.count += 1;
        }
    });

    // 5. Calculate metrics
    const analytics = Array.from(questionsMap.values()).map(q => ({
        ...q,
        accuracy: q.totalResponses
            ? Math.round((q.correctResponses / q.totalResponses) * 100)
            : 0
    }));

    return analytics;
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
    getAllQuizzesForTeacher,    
    getQuizSessionsForTeacher,
    getAllQuizzesForStudent,
    getQuizByIdForStudent,
    getQuizQuestionAnalytics,

    createQuiz,

    restoreQuizById,
    publishQuizById,
    updateQuizById,

    deleteQuizById,
};