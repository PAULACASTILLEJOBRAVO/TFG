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

// Export session controllers
module.exports = {
  getAllSessions,
  getSessionById
};