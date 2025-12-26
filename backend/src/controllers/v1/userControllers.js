// Import services
const userServices = require('../../services/v1/userServices');

// Import models
const User = require('../../models/User');

// Import utils
const { checkExists } = require('../../utils/checkExists');

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

// Controller to create a new user
const createUser = async (req, res) => {
    const { body} = req;
    const { email, username, password } = req.body;
    const currentUser = req.user;

    // Check parameters
    if (!body) return res.status(400).json({ message: 'Username, email and password are required' });

    // Check required fields
    if (!email || !username || !password) return res.status(400).json({ message: 'Username, email and password are required' });

    try{
        await User.canCreateUser(currentUser);

        if (await checkExists(User, 'email', email)) {
            return res.status(409).json({ message: 'The user alredy exists' });
        }

        const newUser = await userServices.createUser({email, username, password});

        res.status(201).json({
            message: 'User created successfully', 
            data: newUser
        });    
    } catch(error){
        // if(error.code === 11000) return res.status(400).json({
        //     message: 'Username is in use',
        //     error: error.message
        // })

        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
}

// Controller to delete an user by ID
const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const { by, reason } = req.body;

    if(!id) return res.status(400).json({ message: 'User ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await userServices.deleteUserById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
         message: 'User deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting user',
            error: error.message
        })
    }
}

// Controller to update an user by ID
const updateUserById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!id) return res.status(400).json({ message: 'User ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        const updatedUser = await userServices.updateUserById({id, body, _id, role});

        if(!updatedUser) return res.status(404).json({ message: 'User not found'});

        res.status(200).json({
            message: 'User updated successfully',
            data: updatedUser
        })
    }catch(error){
        res.status(500).json({
            message: 'Error updating user',
            error: error.message
        })
    }
}

// Controller to update an user's password by ID
const updatePasswordById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { _id, role } = req.user;

    if (!id) return res.status(400).json({ message: 'User ID is required' });
    if (!body.newPassword) return res.status(400).json({ message: 'New password is required' });
    
    try {
        const updatedUser = await userServices.updatePasswordById(id, body, _id, role);

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'User password updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user password',
            error: error.message
        });
    }
}

// Controller to update user's email by ID
const updateEmailById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { _id, role } = req.user;

    if (!id) return res.status(400).json({ message: 'User ID is required' });
    if (!body.newEmail) return res.status(400).json({ message: 'New email is required' });

    try {
        const updatedUser = await userServices.updateEmailById(id, body, _id, role);

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'User email updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user email',
            error: error.message
        });
    }
}

// Controller to update user's role by ID
const updateUserRoleById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { _id, role } = req.user;

    if (!id) return res.status(400).json({ message: 'User ID is required' });
    if (!body.newRole) return res.status(400).json({ message: 'New role is required' });

    try {
        const updatedUser = await userServices.updateUserRoleById(id, body, _id, role);

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'User role updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user role',
            error: error.message
        });
    }
}

// Controller to update user's status by ID
const updateUserStatusById = async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const { _id, role } = req.user;

    if (!id) return res.status(400).json({ message: 'User ID is required' });
    if (!body.newStatus) return res.status(400).json({ message: 'New status is required' });

    try {
        const updatedUser = await userServices.updateUserStatusById(id, body, _id, role);

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
            message: 'User status updated successfully',
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating user status',
            error: error.message
        });
    }
}

//Export controller functions
module.exports = {
    getAllUsers,
    getUserById,
    
    createUser,

    updateUserById,
    updatePasswordById,
    updateEmailById,
    updateUserRoleById,
    updateUserStatusById,

    deleteUserById
};  