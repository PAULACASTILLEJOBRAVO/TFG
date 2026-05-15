const mongoose = require('mongoose');

// Import services
const userServices = require('../../services/v1/userServices');

// Import models
const User = require('../../models/User');

// Import utils
const { checkExists } = require('../../utils/checkExists');

// Debug
const debug = require('debug')('backend:controllers:v1:userControllers');

// User controllers
// Controller to get all users
const getAllUsers = async (req, res) => {
    try {
        debug('Fetching all users');
        const users = await userServices.getAllUsers();

        debug('Users fetched successfully:', users);
        res.status(200).json({
            message: 'Users fetched successfully', 
            data: users
        });
    } catch (error) {
        debug('Error fetching users:', error);
        res.status(500).json({ 
            message: 'Error fetching users', 
            error: error.message 
        });
    }
};

// Controller to get current user
const getMe = async (req, res) => {
    const currentUser = req.user;

    try {
        debug('Fetching current user with ID:', currentUser._id);
        const user = await userServices.getMe(currentUser._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        debug('Current user fetched successfully:', user);
        res.status(200).json({
            message: 'User fetched successfully', 
            data: user
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user', 
            error: error.message 
        });
    }
};

// Controller to get total users stats
const getTotalUsersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const users = await userServices.getTotalUsersStats();
        res.status(200).json({
            message: "Users' stats fetched successfully", 
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching users' stats", 
            error: error.message 
        });
    }
}

// Controller to get active users stats
const getActiveUsersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const users = await userServices.getActiveUsersStats();
        res.status(200).json({
            message: "Active users' stats fetched successfully", 
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching active users' stats", 
            error: error.message 
        });
    }
}

// Controller to get connected users stats
const getConnectedUsersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const users = await userServices.getConnectedUsersStats();
        res.status(200).json({
            message: "Connected users' stats fetched successfully", 
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching connected users' stats", 
            error: error.message 
        });
    }
}

// Controller to get archived users stats
const getArchivedUsersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const users = await userServices.getArchivedUsersStats();
        res.status(200).json({
            message: "Archived users' stats fetched successfully", 
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching archived users' stats",
            error: error.message 
        });
    }
}

// Controller to get students for teacher
const getAllStudentsForTeacher = async (req, res) => {
    const currentUser = req.user;

    try {
        const students = await userServices.getAllStudents();
        res.status(200).json({
            message: "Students fetched successfully", 
            data: students
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching students", 
            error: error.message 
        });
    }
}

// Controller to get students for admin
const getAllStudentsForAdmin = async (req, res) => {
    const currentUser = req.user;

    try {
        const students = await userServices.getAllStudentsWithoutClicker();
        res.status(200).json({
            message: "Students fetched successfully", 
            data: students
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching students", 
            error: error.message 
        });
    }
}

// Controller to create a new user
const createUser = async (req, res) => {
    const { body } = req;
    const { email, username, password } = body;
    const currentUser = req.user;

    debug('Creating new user with data:', body);

    // Check parameters
    if (!body) return res.status(400).json({ message: 'Username, email and password are required' });
    debug('Request body:', body);

    // Check required fields
    if (!email || !username || !password) return res.status(400).json({ message: 'Username, email and password are required' });
    debug('Required fields are present');

    try{
        if (await checkExists(User, 'email', email)) {
            debug('Email already exists:', email);
            return res.status(409).json({ message: 'The user already exists' });
        }

        const newUser = await userServices.createUser(body);
        debug('New user created successfully:', newUser);

        res.status(201).json({
            message: 'User created successfully', 
            data: newUser
        });    
    } catch(error){
        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
}

// Controller to archive an user by ID
const archiveUserById = async (req, res) => {
    debug('Archiving user by ID');
    
    const { id } = req.params;
    debug('User ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'User ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }
    debug('User ID is valid');

    try{
        debug('Attempting to archive user');
        const archived = await userServices.archiveUserById(id);
        debug('Archive operation completed, result:', archived);

        if (!archived) return res.status(404).json({ message: 'User not found' });
        debug('User archived successfully, sending response');

        res.status(200).json({
            message: 'User archived successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error archiving user',
            error: error.message
        })
    }
}

// Controller to restore an user by ID
const restoreUserById = async (req, res) => {
    debug('Restoring user by ID');
    const { id } = req.params;

    debug('User ID:', id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'User ID is incorrect' });
    }
    debug('User ID is valid');

    try{
        debug('Attempting to restore user');
        const restored = await userServices.restoreUserById(id);

        if (!restored) return res.status(404).json({ message: 'User not found' });

        debug('User restored successfully, sending response');
        res.status(200).json({
            message: 'User restored successfully'
        });
    }catch(error){
        debug('Error restoring user:', error);
        res.status(500).json({
            message: 'Error restoring user',
            error: error.message
        })
    }
}

// Controller to update an user by ID
const updateUserById = async (req, res) => {
    debug('Updating user by ID');

    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!body) return res.status(400).json({ message: 'Body is required'});
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'User ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    debug('User ID:', id);
    debug('Request body:', body);

    try{
        debug('Attempting to update user');
        const updatedUser = await userServices.updateUserById({id, body, _id, role});

        if(!updatedUser) return res.status(404).json({ message: 'User not found'});
        debug('User updated successfully, sending response');

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
    debug('Updating user password by ID');
    const { id } = req.params;
    const { body } = req;
    const { _id, role } = req.user;

    if (!id) return res.status(400).json({ message: 'User ID is required' });
    if (!body.newPassword) return res.status(400).json({ message: 'New password is required' });
    
    try {
        debug('Attempting to update user password');
        const updatedUser = await userServices.updatePasswordById({id, body, _id, role});

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        debug('User password updated successfully, sending response');

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

// Controller to permanently delete an user by ID
const deleteUserPermanentlyById = async (req, res) => {
    debug('Permanently deleting user by ID');
    
    const { id } = req.params;
    debug('User ID:', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'User ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }
    debug('User ID is valid');

    try{
        debug('Attempting to permanently delete user');
        const deleted = await userServices.deleteUserPermanentlyById(id);
        debug('Delete operation completed, result:', deleted);

        if (!deleted) return res.status(404).json({ message: 'User not found' });
        debug('User permanently deleted successfully, sending response');

        res.status(200).json({
            message: 'User permanently deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error permanently deleting user',
            error: error.message
        })
    }
}

//Export controller functions
module.exports = {
    getAllUsers,
    getMe,
    getTotalUsersStats,
    getActiveUsersStats,
    getConnectedUsersStats,
    getArchivedUsersStats,
    getAllStudentsForTeacher,
    getAllStudentsForAdmin,
    
    createUser,

    updateUserById,
    updatePasswordById,
    restoreUserById,
    archiveUserById,

    deleteUserPermanentlyById
};  