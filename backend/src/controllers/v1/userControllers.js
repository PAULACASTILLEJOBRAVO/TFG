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

// Controller to get users' stats
const getTotalUsersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const canAccess = await User.canGetAdminUsers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});

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

// Controller to get students' stats
const getTotalStudentsStatsForTeacher = async (req, res) => {
    const currentUser = req.user;

    try {
        const canAccess = await User.canGetTeacherStudents(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});

        const students = await userServices.getTotalStudentsStatsForTeacher(currentUser._id);
        res.status(200).json({
            message: "Students' stats fetched successfully", 
            data: students
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching students' stats", 
            error: error.message 
        });
    }
}

// Controller to get students for teacher
const getAllStudentsForTeacher = async (req, res) => {
    const currentUser = req.user;

    try {
        const canAccess = await User.canGetTeacherStudents(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});

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
        const canAccess = await User.canGetAdminStudents(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});

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
        const canAccess = await User.canCreateUser(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User has permission to create new user');

        if (await checkExists(User, 'email', email)) {
            debug('Email already exists:', email);
            return res.status(409).json({ message: 'The user alredy exists' });
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

// Controller to delete an user by ID
const deleteUserById = async (req, res) => {
    debug('Deleting user by ID');
    
    const { id } = req.params;
    debug('User ID:', id);

    if(!id) return res.status(400).json({ message: 'User ID is required'});
    debug('User ID is valid');

    try{
        debug('Attempting to delete user');
        const deleted = await userServices.deleteUserById(id);
        debug('Delete operation completed, result:', deleted);

        if (!deleted) return res.status(404).json({ message: 'User not found' });
        debug('User deleted successfully, sending response');

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

// Controller to delete an user by ID
const restoreUserById = async (req, res) => {
    debug('Restoring user by ID');
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'User ID is required'});

    try{
        const restored = await userServices.restoreUserById(id);

        if (!restored) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({
         message: 'User restored successfully'
        });
    }catch(error){
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

    if(!id) return res.status(400).json({ message: 'User ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

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

//Export controller functions
module.exports = {
    getAllUsers,
    getUserById,
    getTotalUsersStats,
    getTotalStudentsStatsForTeacher,
    getAllStudentsForTeacher,
    getAllStudentsForAdmin,
    
    createUser,

    updateUserById,
    updatePasswordById,
    restoreUserById,

    deleteUserById
};  