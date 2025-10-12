// Import services
const sessionService = require('../../services/v1/sessionServices');

// Session controllers
// Controller to get all sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await sessionService.getAllSessions();
    res.status(200).json({
        message: 'Sessions fetched successfully',
        sessions: sessions
    });
  } catch (error) {
    res.status(500).json({ 
        message: 'Error fetching sessions', 
        error: error.message 
    });
  }
};

// Export session controllers
module.exports = {
  getAllSessions,
};