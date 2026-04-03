// Import services
const roleServices = require('../../services/v1/roleServices');

// Role controllers
// Controller to fetch all roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleServices.getAllRoles();

        res.status(200).json({
            message: 'Roles fetched successfully', 
            data: roles
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching roles', 
            error: error.message 
        });
    }
}

// Export controller functions
module.exports = {
    getAllRoles
}