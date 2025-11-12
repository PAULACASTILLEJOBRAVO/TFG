// Import models
const { get } = require('mongoose');
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

// Service to delete an user by ID
const deleteUserById = async (id, by = null, reason = 'User removed via service') => {
    try {
        const user = await getUserById(id);
        if (!user) return false; // If the user doesn't exist, return false

        await User.softDeleteById(id, { by, reason });
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllUsers,
    getUserById,
    
    createUser,

    deleteUserById,
};