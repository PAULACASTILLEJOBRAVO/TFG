// Import services
const sessionServices = require('../../services/v1/sessionServices');

// Session controllers
// Controller to get all sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionServices.getAllSessions();
    res.status(200).json({
        message: 'Sessions fetched successfully',
        data: sessions
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching sessions', 
        error: error.message 
    });
  }
};

// Controller to get a session by ID
const getSessionById = async (req, res) => {
    const {id} = req.params;

    if(!id) return res.status(400).json({ message: 'Session ID is required' });
    
    try{
        const session = await sessionServices.getSessionById(id);

        if (!session) return res.status(404).json({ message: 'Session not found' });
        
        res.status(200).json({
            message: 'Session fetched successfully', 
            data: session
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching session', 
            error: error.message 
        });
    }
}

// Controller to create a new session
const createSession = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid session data. Body is required' });

    try{
        const newSession = await sessionServices.createSession(body);

        res.status(201).json({
            message: 'Session created successfully', 
            data: newSession
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating session', 
            error: error.message 
        });
    }
}

// Controller to delete a session by ID
const deleteSessionById = async (req, res) => {
    const {id} = req.params;
    const { by, reason } = req.body;

    if(!id) return res.status(400).json({ message: 'Session ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await sessionServices.deleteSessionById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'Session not found' });

        res.status(200).json({
         message: 'Session deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting session',
            error: error.message
        })
    }
}

// Controller to complete a session by ID
const completeSessionById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!id) return res.status(400).json({ message: 'Session ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        const updatedSession = await sessionServices.completeSessionById({id, body, _id, role});

        if(!updatedSession) return res.status(404).json({ message: 'Session not found'});

        res.status(200).json({
            message: 'Session completed successfully',
            data: updatedSession
        })
    }catch(error){
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

    if(!id) return res.status(400).json({ message: 'Session ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        const updatedSession = await sessionServices.updateSessionById({id, body, _id, role});

        if(!updatedSession) return res.status(404).json({ message: 'Session not found'});

        res.status(200).json({
            message: 'Session updated successfully',
            data: updatedSession
        })
    }catch(error){
        res.status(500).json({
            message: 'Error updating session',
            error: error.message
        })
    }
}
    

// Export session controllers
module.exports = {
  getAllSessions,
  getSessionById,

  createSession,

  completeSessionById,
  updateSessionById,

  deleteSessionById,
};