// Import models
const Session = require('../../models/Session');

// Session services
// Service to get all sessions
const getAllSessions = async () => {
  return await Session.find().populate('teacherId').populate('playerIds').populate('quizId').populate('courseId');
};

// Service to get a session by ID
const getSessionById = async (id) => {
  return await Session.findById(id).populate('teacherId').populate('playerIds').populate('quizId').populate('courseId');
};

// Service to create a new session
const createSession = async (body) => {
    try{
        return await Session.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export session services
module.exports = {
  getAllSessions,
  getSessionById,

  createSession
};