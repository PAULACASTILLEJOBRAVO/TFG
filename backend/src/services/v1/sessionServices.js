// Import models
const Session = require('../../models/Session');

// Session services
// Service to get all sessions
const getAllSessions = async () => {
  return await Session.find().populate('teacherId').populate('deviceIds').populate('quizId');
};

// Service to get a session by ID
const getSessionById = async (id) => {
  return await Session.findById(id).populate('teacherId').populate('deviceIds').populate('quizId');
};

// Service to create a new session
const createSession = async (body) => {
    try{
        return await Session.create(body);
    } catch(error){
        throw error.message;
    }
}

// Service to delete a session by ID
const deleteSessionById = async (id, by = null, reason = 'Session removed via service') => {
    try {
        const session = await getSessionById(id);
        if (!session) return false; // If the session doesn't exist, return false

        await Session.softDeleteById(id, { by, reason });
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service to restore a session by ID
const completeSessionById = async ({id, body, _id, role}) => {
    try{
        const session = await getSessionById(id);
        if(!session) return false;

        const updatedSession = await Session.completeById(id, body, { _id, role });
        return updatedSession;
    }catch(error){
        throw new Error(error.message);
    }
}

// Export session services
module.exports = {
  getAllSessions,
  getSessionById,

  createSession,
  completeSessionById,

  deleteSessionById
};