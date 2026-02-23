// Import constants
const { editableFields } = require('../utils/constants');

// Function to check if a user can edit a specific field
const getUserEditableFields = (role, isSelf) => {
    // Admins can edit all fields, teachers and students can only edit their own specific fields
    if(role === 'admin') return editableFields.user.admin;
    // Teachers and students can only edit their own data 
    if((role === 'teacher' || role === 'student') && isSelf) return editableFields.user[role];
}

const getQuizEditableFields = (role, isSelf) => {
    // Admins can edit all fields, teachers and students can only edit their own specific fields
    if(role === 'admin') return editableFields.quiz.admin;
    // Teachers can only edit their own data 
    if((role === 'teacher') && isSelf) return editableFields.quiz[role];
}

const getClickerEditableFields = (role, isSelf) => {
    // Admins can edit all fields, teachers and students can only edit their own specific fields
    if(role === 'admin') return editableFields.clicker[role];
    // Teachers can only edit their own data 
    if((role === 'teacher') && isSelf) return editableFields.clicker[role];
}

// Export the function
module.exports = {
    getUserEditableFields,
    getQuizEditableFields,
    getClickerEditableFields
};