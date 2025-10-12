// Import services
const userService = require('../../services/v1/userServices');

// User controllers
// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({
            message: 'Users fetched successfully', 
            users: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

//Export controller functions
module.exports = {
    getAllUsers
};  