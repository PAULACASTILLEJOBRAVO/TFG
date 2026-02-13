// Validations by id
// Middleware to validate teacher role
async function validateTeacherRoleById(userId) {
    const User = require('../models/User');

    const teacher = await User.findById(userId).select('role');

    if (!teacher || teacher.role !== 'teacher') throw new Error('Only teachers can perform this action');
    
    return true;
}

// Middleware to validate admin role
async function validateAdminRoleById(userId) {
    const User = require('../models/User');

    const admin = await User.findById(userId).select('role');

    if (!admin || admin.role !== 'admin') throw new Error('Only admins can perform this action');
    
    return true;
}

// Validation by current user
// Middleware to validate admin role
async function validateAdminRole(currentUser) {
    if (!currentUser) throw new Error('Unauthorized'); 

    if(currentUser.role !== 'admin') throw new Error('Only admins can perform this action');

    return true;
}

// Middleware to validate teacher role
async function validateTeacherRole(currentUser) {
    if (!currentUser) throw new Error('Unauthorized'); 

    if(currentUser.role !== 'teacher') throw new Error('Only teachers can perform this action');

    return true;
}

module.exports = {
    validateTeacherRoleById,
    validateAdminRoleById,

    validateAdminRole,
    validateTeacherRole,
};