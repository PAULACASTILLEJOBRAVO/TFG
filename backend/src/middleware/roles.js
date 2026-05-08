const { 
    validateTeacherRole, 
    validateAdminRole 
} = require('./validationRole');

const debug = require('debug')('backend:middleware:roles');

// Middleware to check if user has teacher role
const requireTeacherRole = async (req, res, next) => {
    try {
        debug('Validating teacher role for user: ', req.user ? req.user._id : 'unknown');
        await validateTeacherRole(req.user);

        debug('Teacher role validation successful for user: ', req.user._id);
        next();
    } catch (error) {
        debug('Teacher role validation failed: ', error.message);
        res.status(403).json({ error: error.message });
    }
}

// Middleware to check if user has admin role
const requireAdminRole = async (req, res, next) => {
    try {
        debug('Validating admin role for user: ', req.user ? req.user._id : 'unknown');
        await validateAdminRole(req.user);

        debug('Admin role validation successful for user: ', req.user._id);
        next();
    } catch (error) {
        debug('Admin role validation failed: ', error.message);
        res.status(403).json({ error: error.message });
    }
}

module.exports = {
    requireTeacherRole,
    requireAdminRole
};