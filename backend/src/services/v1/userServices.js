// Import models
const User = require('../../models/User');
const Quiz = require('../../models/Quiz');
const Clicker = require('../../models/Clicker');
const { get } = require('mongoose');

// Debug
const debug = require('debug')('backend:services:v1:userServices');

// User services
// Service to fetch all users
const getAllUsers = async () => {
    debug('Fetching all users');
    return await User.find();
};

// Service to fetch an user by ID
const getUserById = async (id) => {
    debug('Fetching user by ID:', id);
    return await User.findById(id);
}

// Service to fetch users' stats
const getTotalUsersStats = async () => {
    debug('Fetching total users stats');
    return await User.countDocuments();
}

// Service to fetch connected users stats
const getConnectedUsersStats = async () => {
    debug('Fetching connected users stats');
    return await User.countDocuments({ 
        status: 'active',
        isOnline: true 
    });
}

// Service to fetch active users stats
const getActiveUsersStats = async () => {
    debug('Fetching active users stats');
    return await User.countDocuments({ status: 'active' });
}

// Service to fetch archived users stats
const getArchivedUsersStats = async () => {
    debug('Fetching archived users stats');
    return await User.countDocuments({ status: 'inactive' });
}

// Service to fetch users' stats
const getTotalStudentsStatsForTeacher = async (id) => {
    debug('Fetching total students stats for teacher with ID:', id);
    const quizzes = await Quiz.find({
        creatorId: id, 
        status: "published",
    });

    debug('Quizzes found for teacher:', quizzes);
    const studentIds = quizzes.flatMap(quiz => quiz.playerIds);

    debug('Student IDs found for teacher:', studentIds);
    return await User.countDocuments({
        _id: { $in: studentIds },
        status: "active",
        role: "student"
    });
}

// Service to fetch all students
const getAllStudents = async () => {
    debug('Fetching all students');
    return await User.find({ 
        status: "active",  
        role: "student" 
    }).select('-password');
}

// Service to fetch all students without clicker
const getAllStudentsWithoutClicker = async () => {
    debug('Fetching all students without clicker');
    const studentsWithClicker = await Clicker.distinct('assignedToUserId', {
        status: "assigned",
    });

    debug('Student IDs with assigned clicker:', studentsWithClicker);
    return await User.find({
        _id: { $nin: studentsWithClicker },
        status: "active",
        role: "student"
    }).select('-password'); 
}

// Service to create a new user
const createUser = async (body) => {
    try{
        debug('Creating new user with data:', body);
        return await User.create(body);
    } catch(error){
        throw error.message;
    }
}

// Service to delete an user by ID
const deleteUserById = async (id) => {
    try {
        debug('Attempting to delete user with ID:', id);

        const user = await getUserById(id);
        debug('User found:', user);

        if (!user) return false; // If the user doesn't exist, return false
        debug('User found:', user);

        await User.softDeleteById(id);
        debug('User soft-deleted successfully');

        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service to restore an user by ID
const restoreUserById =  async (id) => {
    try {
        debug('Attempting to restore user with ID:', id);
        const user = await getUserById(id);
        if(!user) return false;

        debug('User found:', user);
        await User.restoreById(id);

        debug('User restored successfully');
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to update an user by ID
const updateUserById = async ({id, body, _id, role}) => {
    try{
        debug('Attempting to update user with ID:', id, 'and data:', body);
        const user = await getUserById(id);
        if(!user) return false;

        debug('User found:', user);
        const updateUser = await User.updateById(id, body, { _id, role });
        
        debug('User updated successfully:', updateUser);
        return updateUser;
    }catch(error){
        throw new Error(error.message);
    }
}

// Service to update an user's password by ID
const updatePasswordById = async ({id, body, _id, role}) => {
    try{
        debug('Attempting to update password for user with ID:', id);
        const user = await getUserById(id);
        if(!user) return false;

        debug('User found:', user);
        const updatePassword = await User.updatePasswordById(id, body, { _id, role });

        debug('User password updated successfully:', updatePassword);
        return updatePassword;
    }catch(error){
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllUsers,
    getUserById,
    getTotalUsersStats,
    getActiveUsersStats,
    getConnectedUsersStats,
    getArchivedUsersStats,
    getTotalStudentsStatsForTeacher,
    getAllStudents,
    getAllStudentsWithoutClicker,

    createUser,

    updateUserById,
    updatePasswordById,
    
    restoreUserById,

    deleteUserById,
};