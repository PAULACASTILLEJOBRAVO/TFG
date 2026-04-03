// Import models
const User = require('../../models/User');

// Authentication services
// Service to register an user
const registerUser = async (body) => {
    try{
        return await User.create(body);
    }catch (error){
        throw error.message;
    }
}

// Export service functions
module.exports = {
    registerUser
}