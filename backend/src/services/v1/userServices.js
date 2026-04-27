// Import models
const User = require('../../models/User');
const Quiz = require('../../models/Quiz');
const Clicker = require('../../models/Clicker');
const { mongo, default: mongoose } = require('mongoose');

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

// Service to fetch the profile of the currently authenticated user
const getMe = async (id) => {
    debug('Fetching profile for user with ID:', id);
    return user = await User.findById(id).select("-password");
};

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
        debug('Error creating user:', error);
        throw new Error(error.message);
    }
}

// Service to archive an user by ID
const archiveUserById = async (id) => {
    try {
        debug('Attempting to archive user with ID:', id);

        const user = await getUserById(id);
        debug('User found:', user);

        if (!user) return false; // If the user doesn't exist, return false
        debug('User found:', user);

        await User.softDeleteById(id);
        debug('User soft-deleted successfully');

        return true; // Return true if deletion was successful
    } catch (error) {
        debug('Error archiving user:', error);
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
        debug('Error restoring user:', error);
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
        debug('Error updating user:', error);
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
        const updatePassword = await User.updatePasswordById(id, body, { _id, role }).populate('-password');

        debug('User password updated successfully:', updatePassword);
        return updatePassword;
    }catch(error){
        debug('Error updating user password:', error);
        throw new Error(error.message);
    }
}

// Service to delete an user permanently by ID
const deleteUserPermanentlyById = async (id) => {
    try {
        debug('Attempting to permanently delete user with ID:', id);

        const user = await getUserById(id);
        if(!user) return false;

        debug('User found:', user);

        const Quiz = mongoose.model('Quiz');
        const Session = mongoose.model('Session');
        const Clicker = mongoose.model('Clicker');
        const Response = mongoose.model('Response');
        const Result = mongoose.model('Result');

        // Cascade delete response created by a student
        if(user.role === "student"){
            debug('User is a student, deleting associated responses and results');
            await Promise.all([
                Response.deleteMany({ playerId: id }),
                Result.deleteMany({ playerId: id }),
                Clicker.updateMany({ assignedToUserId: id }, { $set: { assignedToUserId: null, status: "available" } })
            ]);

            debug('Student cleanup completed: responses, results deleted and clickers unassigned');
        }

        // Cascade delete quizzes created by a teacher
        if(user.role === "teacher"){
            debug('User is a teacher, deleting associated quizzes');

            // Delete dependencies: responses and results associated with those sessions
            await Promise.all([
                Response.deleteMany({ sessionId: { $in: await Session.find({ teacherId: id }).distinct('_id') } }),
                Result.deleteMany({ sessionId: { $in: await Session.find({ teacherId: id }).distinct('_id') } })
            ]);


            // Delete the teacher's quizzes and sessions
            await Promise.all([
                Quiz.deleteMany({ creatorId: id }),
                Session.deleteMany({ teacherId: id })
            ]); 

            debug('Teacher cleanup completed: quizzes deleted');
        }

        // Finally, delete the user permanently
        await User.deleteOne({ _id: id });

        debug('User permanently deleted successfully');
        return true;
    }catch (error) {
        debug('Error permanently deleting user:', error);
        throw new Error(error.message);
    }
};

// Export service functions
module.exports = {
    getAllUsers,
    getMe,
    getTotalUsersStats,
    getActiveUsersStats,
    getConnectedUsersStats,
    getArchivedUsersStats,
    getAllStudents,
    getAllStudentsWithoutClicker,

    createUser,

    updateUserById,
    updatePasswordById,
    restoreUserById,
    archiveUserById,

    deleteUserPermanentlyById
};