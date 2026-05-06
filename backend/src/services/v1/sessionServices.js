// Import models
const Session = require('../../models/Session');

// Import services
const resultServices = require('./resultServices');

// Debugging
const debug = require('debug')('backend:services:v1:sessionServices');

// Session services
// Service to get a session by ID
const getSessionById = async (id) => {
    debug(`Getting session with ID ${id}`);
    return await Session.findById(id).populate('teacherId').populate('deviceIds').populate('quizId');
};

// Service to create a new session
const createSession = async (body) => {
    try{
        debug(`Creating new session with data:`, body);
        return await Session.create(body);
    } catch(error){
        debug('Error creating session:', error);
        throw new Error(error.message);
    }
}

// Service to restore a session by ID
const completeSessionById = async ({id, body, _id, role}) => {
    try{
        debug(`Completing session with ID ${id}`);
        const session = await getSessionById(id);
        if(!session) return false;

        debug(`Session found:`, session);
        const updatedSession = await Session.completeById(id, body, { _id, role });

        // Generate results for all devices in the session
        debug(`Generating results for session with ID ${id}`);
        await Promise.all(
            session?.deviceIds.map(deviceId =>
                resultServices.generateResults({
                    playerId: deviceId.assignedToUserId, 
                    sessionId: updatedSession._id
                })
            )
        );

        // Calculate ranks after generating results
        debug(`Calculating ranks for session with ID ${id}`);
        await resultServices.calculateRanks(updatedSession._id);
        
        return updatedSession;
    }catch(error){
        debug('Error completing session:', error);
        throw new Error(error.message);
    }
}

// Service to update a session by ID
const updateSessionById = async ({id, body, _id, role}) => {
    try{
        debug(`Updating session with ID ${id} using data:`, body);
        const session = await getSessionById(id);
        if(!session) return false;

        debug(`Session found:`, session);
        const updatedSession = await Session.updateById(id, body, { _id, role });
        return updatedSession;
    }catch(error){
        debug('Error updating session:', error);
        throw new Error(error.message);
    }
}

// Export session services
module.exports = {
  createSession,
  completeSessionById,
  updateSessionById,
};