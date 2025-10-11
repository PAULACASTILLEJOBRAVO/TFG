const mongoose = require('mongoose');
const debug = require('debug')('backend:middleware:validationRole');
const User = require('../models/User');

// Middleware to validate teacher role
async function validateTeacherRole(userId) {
    const teacher = await User.findById(userId);

    if (!teacher || teacher.role !== 'teacher') {
        throw new Error('Only teachers can perform this action');
    }
       
    return true;
}

module.exports = {validateTeacherRole};