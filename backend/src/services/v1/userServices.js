// Import models
const User = require('../../models/User');
const Quiz = require('../../models/Quiz');
const Clicker = require('../../models/Clicker');

// User services
// Service to fetch all users
const getAllUsers = async () => {
    return await User.find();
};

// Service to fetch an user by ID
const getUserById = async (id) => {
    return await User.findById(id);
}

// Service to fetch users' stats
const getTotalUsersStats = async () => {
    return await User.countDocuments({
        isActive: true,
        isDeleted: false
    });
}

// Service to fetch users' stats
const getTotalStudentsStatsForTeacher = async (id) => {
    const quizzes = await Quiz.find({
        creatorId: id, 
        isActive: true, 
        status: "published",
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ],
    });

    const studentIds = quizzes.flatMap(quiz => quiz.playerIds);

    return await User.countDocuments({
        _id: { $in: studentIds },
        isActive: true,
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ],
        role: "student"
    });
}

// Service to fetch all students
const getAllStudents = async () => {
    return await User.find({ 
        isActive: true, 
        $or: [ 
            { isDeleted: false }, 
            { isDeleted: { $exists: false } } 
        ], 
        role: "student" 
    }).select('-password');
}

// Service to fetch all students without clicker
const getAllStudentsWithoutClicker = async () => {
    const studentsWithClicker = await Clicker.distinct('assignedToUserId', {
        isActive: true, 
        status: "assigned",
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ],
    });

    return await User.find({
        _id: { $nin: studentsWithClicker },
        isActive: true,
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ],
        role: "student"
    }).select('-password'); 
}

// Service to create a new user
const createUser = async (body) => {
    try{
        return await User.create(body);
    } catch(error){
        throw error.message;
    }
}

// Service to delete an user by ID
const deleteUserById = async ({id, by = null, reason = 'User removed via service'}) => {
    try {
        const user = await getUserById(id);
        if (!user) return false; // If the user doesn't exist, return false

        await User.softDeleteById(id, { by, reason });
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service to restore an user by ID
const restoreUserById =  async (id) => {
    try {
        const user = await getUserById(id);
        if(!user) return false;

        await User.restoreById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to update an user by ID
const updateUserById = async ({id, body, _id, role}) => {
    try{
        const user = await getUserById(id);
        if(!user) return false;

        const updateUser = await User.updateById(id, body, { _id, role });
        return updateUser;
    }catch(error){
        throw new Error(error.message);
    }
}

// Service to update an user's password by ID
const updatePasswordById = async ({id, body, _id, role}) => {
    try{
        const user = await getUserById(id);
        if(!user) return false;

        const updatePassword = await User.updatePasswordById(id, body, { _id, role });
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
    getTotalStudentsStatsForTeacher,
    getAllStudents,
    getAllStudentsWithoutClicker,
    
    createUser,

    updateUserById,
    updatePasswordById,
    
    restoreUserById,

    deleteUserById,
};