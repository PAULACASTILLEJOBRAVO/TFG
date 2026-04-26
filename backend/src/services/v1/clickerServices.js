// Import models
const Clicker = require('../../models/Clicker');

// Debug
const debug = require('debug')('backend:services:v1:clickerServices');

// Clicker services
// Service to fetch all clickers
const getAllClickers = async () => {
    debug('Fetching all clickers');
    return await Clicker.find().populate('assignedToUserId', '-password').populate('adminId').sort({ deviceCode: 1 });
};

// Service to fetch a clicker by ID
const getClickerById = async (id) => {
    debug('Fetching clicker by ID:', id);
    return await Clicker.findById(id).populate('assignedToUserId').populate('adminId');
}

// Service to fetch clickers stats
const getTotalClickersStats = async () => {
    debug('Fetching total clickers stats');
    return await Clicker.countDocuments();
}

// Service to fetch active clickers stats
const getActiveClickersStats = async () => {
    debug('Fetching active clickers stats');
    return await Clicker.countDocuments({
        status: { $in: ['assigned', 'available'] },
    });
}

// Service to fetch in use clickers stats
const getInUseClickersStats = async () => {
    debug('Fetching in use clickers stats');
    return await Clicker.countDocuments({
        status: 'assigned'
    });
}

// Service to fetch available clickers stats
const getAvailableClickersStats = async () => {
    debug('Fetching available clickers stats');
    return await Clicker.countDocuments({
        status: 'available'
    });
}

// Service to fetch inactive clickers stats
const getInactiveClickersStats = async () => {
    debug('Fetching inactive clickers stats');
    return await Clicker.countDocuments({
        status: { $in: ['retired', 'damaged'] },
    });
}

// Service to create a new clicker
const createClicker = async (body) => {
    try{
        debug('Creating new clicker with body:', body);
        return await Clicker.create(body);
    } catch(error){
        debug('Error creating clicker:', error);
        throw new Error(error.message);
    }
}

// Service to delete a clicker by ID
const deleteClickerById = async (id) => {
    try {
        debug('Deleting clicker with ID:', id);

        const clicker = await getClickerById(id);
        if (!clicker) return false; // If the clicker doesn't exist, return false

        debug('Clicker found:', clicker);
        await Clicker.softDeleteById(id);

        debug('Clicker deleted successfully');
        return true; // Return true if deletion was successful
    } catch (error) {
        debug('Error deleting clicker:', error);
        throw new Error(error.message);
    }
}

// Service to restore a clicker by ID
const restoreClickerById =  async (id) => {
    try {
        debug('Restoring clicker with ID:', id);
        const clicker = await getClickerById(id);
        if(!clicker) return false;

        debug('Clicker found:', clicker);
        await Clicker.restoreById(id);

        debug('Clicker restored successfully');
        return true;
    }catch (error) {
        debug('Error restoring clicker:', error);
        throw new Error(error.message);
    }
}

// Service to update a clicker by ID
const updateClickerById = async ({id, body, _id, role}) => {
    try {
        debug('Updating clicker with ID:', id, 'and body:', body);
        const clicker = await getClickerById(id);
        if (!clicker) return false; 

        debug('Clicker found:', clicker);
        const updatedClicker = await Clicker.updateById(id, body, { _id, role });

        debug('Clicker updated successfully:', updatedClicker);
        return updatedClicker; // Return the updated clicker
    } catch (error) {
        debug('Error updating clicker:', error);
        throw new Error(error.message);
    }
}

// Export service functions
module.exports = {
    getAllClickers,
    getActiveClickersStats,
    getInactiveClickersStats,
    getInUseClickersStats,
    getAvailableClickersStats,
    getTotalClickersStats,
    createClicker,

    updateClickerById,
    restoreClickerById,

    deleteClickerById,
};