// Import models
const User = require('../../models/User');

debug = require('debug')('backend:services:v1:authenticationService');

// Authentication services
// Service to register an user
const registerUser = async (body) => {
    try{
        debug('Registering new user with body:', body);
        return (await User.create(body)).populate('-password');
    }catch (error){
        debug('Error registering user:', error);
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    registerUser
}