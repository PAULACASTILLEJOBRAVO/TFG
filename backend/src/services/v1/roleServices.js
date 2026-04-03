// Import models
const Role = require('../../models/Role');

// Role services
// Services to fetch all roles
const getAllRoles = async () => {
    return await Role.find().select("value label").sort({ label: 1 });
};

// Export service funcions
module.exports = {
    getAllRoles
}
