// Import models
const User = require('../../models/User');
const Course = require('../../models/Course');

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
    const courses = await Course.find({
        teacherId: id, 
        isActive: true, 
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ],
    });

    const studentIds = courses.flatMap(course => course.studentIds);

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

        const updateUSer = await User.updateById(id, body, { _id, role });
        return updateUSer;
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

// Service to update an user's email by ID
const updateEmailById = async (id, body, _id, role) => {
    try{
        const user = await getUserById(id);
        if(!user) return false;

        const updateEmail = await User.updateEmailById(id, body, { _id, role });
        return updateEmail;
    }catch(error){
        throw new Error(error.message);
    }
}

// Service to update an user's role by ID
const updateUserRoleById = async (id, body, _id, role) => {
    try{
        const user = await getUserById(id);
        if(!user) return false;

        const updateRole = await User.updateRoleById(id, body.newRole, { _id, role });
        return updateRole;
    }catch(error){
        throw new Error(error.message);
    }
}

// Service to update an user's status by ID
const updateUserStatusById = async (id, body, _id, role) => {
    try{
        const user = await getUserById(id).select('-password');
        if(!user) return false;

        const updateStatus = await User.updateStatusById(id, body.newStatus, { _id, role });
        return updateStatus;
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
    
    createUser,

    updateUserById,
    updatePasswordById,
    updateEmailById,
    updateUserRoleById,
    updateUserStatusById,

    restoreUserById,

    deleteUserById,
};