// Import models
const Difficulty = require('../../models/Difficulty');

// Debug
const debug = require('debug')('backend:services:v1:difficultyServices');

// Difficulty services
// Services to fetch all difficulties
const getAllDifficulties = async () => {
    debug('Fetching all difficulties from database');
    return await Difficulty.find().select("value");
};

// Export service functions
module.exports = {
    getAllDifficulties
}
