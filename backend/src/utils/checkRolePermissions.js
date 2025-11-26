// Import constants
const { editableFields } = require('../utils/constants');

// Function to check if a user can edit a specific field
const getUserEditableFields = (role, isSelf) => {
    if(role === 'admin') return editableFields.user.admin;
    if((role === 'teacher' || role === 'student') && isSelf) return editableFields.user[role];
    
    throw new Error('You do not have permission to update this user');
}

// Export the function
module.exports = {
    getUserEditableFields,
};