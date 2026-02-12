// Import models
const Difficulty = require('../../models/Difficulty');

// Difficulty services
// Services to fetch all difficulties
const getAllDifficulties = async () => {
    return await Difficulty.find().select("value label");
};

// Export service funcions
module.exports = {
    getAllDifficulties
}
