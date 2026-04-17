// Import models
const Clicker = require('../../models/Clicker');

// Clicker services
// Service to fetch all clickers
const getAllClickers = async () => {
    return await Clicker.find().populate('assignedToUserId').populate('adminId').sort({ deviceCode: 1 });
};

// Service to fetch a clicker by ID
const getClickerById = async (id) => {
    return await Clicker.findById(id).populate('assignedToUserId').populate('adminId');
}

// Service to fetch clickers' stats
const getActiveClickersStats = async () => {
    return await Clicker.countDocuments({
        assignedToUserId: { $ne: null },
        status: { $ne: 'retired', $ne: 'damaged' },
    });
}

// Service to create a new clicker
const createClicker = async (body) => {
    try{
        return await Clicker.create(body);
    } catch(error){
        throw error.message;
    }
}

// Service to delete a clicker by ID
const deleteClickerById = async (id, by = null, reason = 'Clicker deleted via service') => {
    try {
        const clicker = await getClickerById(id);
        if (!clicker) return false; // If the clicker doesn't exist, return false

        await Clicker.softDeleteById(id);
        return true; // Return true if deletion was successful
    } catch (error) {
        throw new Error(error.message);
    }
}

// Service to restore a clicker by ID
const restoreClickerById =  async (id) => {
    try {
        const clicker = await getClickerById(id);
        if(!clicker) return false;

        await Clicker.restoreById(id);
        return true;
    }catch (error) {
        throw new Error(error.message);
    }
}

// Service to update a clicker by ID
const updateClickerById = async ({id, body, _id, role}) => {
    try {
        const clicker = await getClickerById(id);
        if (!clicker) return false; 

        const updatedClicker = await Clicker.updateById(id, body, { _id, role });
        return updatedClicker; // Return the updated clicker
    } catch (error) {
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllClickers,
    getClickerById,
    getActiveClickersStats,
    
    createClicker,

    updateClickerById,
    restoreClickerById,

    deleteClickerById,
};