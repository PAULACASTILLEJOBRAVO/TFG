// Import models
const User = require('../../models/User');

// User services
// Service to fetch all users
const getAllUsers = async () => {
    return await User.find();
};

// Export service functions
module.exports = {
    getAllUsers
};