// Import models
const User = require('../../models/User');

// User services
// Service to fetch all users
const getAllUsers = async () => {
    return await User.find();
};

// Service to fetch an user by ID
const getUserById = async (id) => {
    return await User.findById(id);
}

// Export service functions
module.exports = {
    getAllUsers,
    getUserById
};