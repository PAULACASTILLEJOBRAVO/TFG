const mongoose = require('mongoose');

// Import services
const sessionServices = require('../../services/v1/sessionServices');

// Debbugging
const debug = require('debug')('backend:controllers:v1:sessionControllers');

// Session controllers
// Controller to create a new session
const createSession = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid session data. Body is required' });

    try{
        debug('Creating new session');
        const newSession = await sessionServices.createSession(body);

        debug('Session created successfully:', newSession);
        res.status(201).json({
            message: 'Session created successfully', 
            data: newSession
        });    
    } catch(error){
        debug('Error creating session:', error);
        res.status(500).json({ 
            message: 'Error creating session', 
            error: error.message 
        });
    }
}

// Controller to complete a session by ID
const completeSessionById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!body) return res.status(400).json({ message: 'Body is required'});
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Session ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    try{
        debug(`Completing session with ID ${id}`);
        const updatedSession = await sessionServices.completeSessionById({id, body, _id, role});

        if(!updatedSession) return res.status(404).json({ message: 'Session not found'});

        debug(`Session with ID ${id} completed successfully:`, updatedSession);
        res.status(200).json({
            message: 'Session completed successfully',
            data: updatedSession
        })
    }catch(error){
        debug('Error completing session:', error);
        res.status(500).json({
            message: 'Error completing session',
            error: error.message
        })
    }
}

// Controller to update a session by ID
const updateSessionById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!body) return res.status(400).json({ message: 'Body is required'});
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Session ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    try{
        debug(`Updating session with ID ${id}`);
        const updatedSession = await sessionServices.updateSessionById({id, body, _id, role});

        if(!updatedSession) return res.status(404).json({ message: 'Session not found'});

        debug(`Session with ID ${id} updated successfully:`, updatedSession);
        res.status(200).json({
            message: 'Session updated successfully',
            data: updatedSession
        })
    }catch(error){
        debug('Error updating session:', error);
        res.status(500).json({
            message: 'Error updating session',
            error: error.message
        })
    }
}

// Export session controllers
module.exports = {
  createSession,

  completeSessionById,
  updateSessionById,
};