// Import models
const Role = require('../../models/Role');

// Role services
// Services to fetch all roles
const getAllRoles = async () => {
    debug('Fetching all roles from the database');
    return await Role.find().select("value").sort({ label: 1 });
};

// Export service funcions
module.exports = {
    getAllRoles
}
