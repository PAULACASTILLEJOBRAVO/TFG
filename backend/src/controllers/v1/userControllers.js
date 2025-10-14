// Import services
const userServices = require('../../services/v1/userServices');

// User controllers
// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        res.status(200).json({
            message: 'Users fetched successfully', 
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

// Controller to get an user by ID
const getUserById = async (req, res) => {
    const {id} = req.params;

    if(!id) return res.status(400).json({ message: 'User ID is required' });
    
    try{
        const user = await userServices.getUserById(id);

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json({
            message: 'User fetched successfully', 
            data: user
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching user', 
            error: error.message 
        });
    }
}

//Export controller functions
module.exports = {
    getAllUsers,
    getUserById
};  