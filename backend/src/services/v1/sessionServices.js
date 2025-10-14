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

// Export session services
module.exports = {
  getAllSessions,
  getSessionById
};