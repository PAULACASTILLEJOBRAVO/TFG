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

// Service to create a new user
const createUser = async (body) => {
    try{
        return await User.create(body);
    } catch(error){
        throw error.message;
    }
}

// Export service functions
module.exports = {
    getAllUsers,
    getUserById,
    
    createUser
};