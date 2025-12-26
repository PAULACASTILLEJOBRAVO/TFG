// Import models
const User = require('../models/User');

// Middleware to validate teacher role
async function validateTeacherRole(userId) {
    const teacher = await User.findById(userId);

    if (!teacher || teacher.role !== 'teacher') throw new Error('Only teachers can perform this action');
    
    return true;
}

// Middleware to validate admin role
async function validateAdminRole(currentUser) {
    if (!currentUser) throw new Error('Unauthorized'); 

    if(currentUser.role !== 'admin') throw new Error('Only admins can perform this action');

    return true;
}

module.exports = {
    validateTeacherRole,
    validateAdminRole
};