const mongoose = require('mongoose');

// Import services
const clickerServices = require('../../services/v1/clickerServices');

// Import models
const Clicker = require('../../models/Clicker');

// Import utils
const { checkExists } = require('../../utils/checkExists');

// Debug
const debug = require('debug')('backend:controllers:v1:clickerControllers');

// Clicker controllers
// Controller to get all clickers
const getAllClickers = async (req, res) => {
    try {
        debug('Fetching all clickers');
        const clickers = await clickerServices.getAllClickers();

        debug('Clickers fetched successfully:', clickers);
        res.status(200).json({
            message: 'Clickers fetched successfully', 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers:', error);
        res.status(500).json({ 
            message: 'Error fetching clickers', 
            error: error.message 
        });
    }
};

// Controller to get clickers stats
const getTotalClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const clickers = await clickerServices.getTotalClickersStats();

        debug('Clickers stats fetched successfully:', clickers);
        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers stats:', error);
        res.status(500).json({ 
            message: "Error fetching clickers' stats", 
            error: error.message 
        });
    }
}

// Controller to get active clickers stats
const getActiveClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const clickers = await clickerServices.getActiveClickersStats();

        debug('Clickers stats fetched successfully:', clickers);
        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers stats:', error);
        res.status(500).json({ 
            message: "Error fetching clickers' stats", 
            error: error.message 
        });
    }
}

// Controller to get in use clickers stats
const getInUseClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const clickers = await clickerServices.getInUseClickersStats();

        debug('Clickers stats fetched successfully:', clickers);
        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers stats:', error);
        res.status(500).json({ 
            message: "Error fetching clickers' stats",
            error: error.message 
        });
    }
}

// Controller to get available clickers stats
const getAvailableClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const clickers = await clickerServices.getAvailableClickersStats();

        debug('Clickers stats fetched successfully:', clickers);
        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers stats:', error);
        res.status(500).json({ 
            message: "Error fetching clickers' stats",
            error: error.message 
        });
    }
}

// Controller to get inactive clickers stats
const getInactiveClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const clickers = await clickerServices.getInactiveClickersStats();

        debug('Clickers stats fetched successfully:', clickers);
        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
        debug('Error fetching clickers stats:', error);
        res.status(500).json({ 
            message: "Error fetching clickers' stats", 
            error: error.message 
        });
    }
}

// Controller to create a new clicker
const createClicker = async (req, res) => {
    const {body} = req;

    if (!body) return res.status(400).json({ message: 'Invalid clicker data. Body is required' });

    try{
        if (await checkExists(Clicker, 'deviceCode', body.deviceCode)) {
            debug('Device code already exists:', body.deviceCode);
            return res.status(409).json({ message: 'The clicker already exists' });
        }
        debug('Creating new clicker with data:', body);
        const newClicker = await clickerServices.createClicker(body);

        debug('Clicker created successfully:', newClicker);
        res.status(201).json({
            message: 'Clicker created successfully', 
            data: newClicker
        });    
    } catch(error){
        debug('Error creating clicker:', error);
        res.status(500).json({ 
            message: 'Error creating clicker', 
            error: error.message 
        });
    }
}

// Controller to delete a clicker by ID
const deleteClickerById = async (req, res) => {
    const {id} = req.params;
    const { by, reason } = req.body; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Clicker ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    try{
        debug('Deleting clicker with ID:', id);
        const deleted = await clickerServices.deleteClickerById(id);

        if (!deleted) return res.status(404).json({ message: 'Clicker not found' });

        debug('Clicker deleted successfully');
        res.status(200).json({
         message: 'Clicker deleted successfully'
        });
    }catch(error){
        debug('Error deleting clicker:', error);
        res.status(500).json({
            message: 'Error deleting clicker',
            error: error.message
        })
    }
}

// Controller to restore a clicker by ID
const restoreClickerById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Clicker ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    try{
        debug('Restoring clicker with ID:', id);
        const restored = await clickerServices.restoreClickerById(id);

        if (!restored) return res.status(404).json({ message: 'Clicker not found' });

        debug('Clicker restored successfully');
        res.status(200).json({
         message: 'Clicker restored successfully'
        });
    }catch(error){
        debug('Error restoring clicker:', error);
        res.status(500).json({
            message: 'Error restoring clicker',
            error: error.message
        })
    }
}

// Controller to update a clicker by ID
const updateClickerById = async (req, res) => {
    const {id} = req.params;
    const {body} = req;
    const { _id, role } = req.user;

    if(!body) return res.status(400).json({ message: 'Body is required'});
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Clicker ID is incorrect' }); // ID is always sent, so we check if it's a valid ObjectId
    }

    try{
        debug('Updating clicker with ID:', id);
        const updatedClicker = await clickerServices.updateClickerById({id, body, _id, role});

        if(!updatedClicker) return res.status(404).json({ message: 'Clicker not found'});

        debug('Clicker updated successfully:', updatedClicker);
        res.status(200).json({
            message: 'Clicker updated successfully',
            data: updatedClicker
        })
    }catch(error){
        debug('Error updating clicker:', error);
        res.status(500).json({
            message: 'Error updating clicker',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllClickers,
    getTotalClickersStats,
    getActiveClickersStats,
    getInactiveClickersStats,
    getInUseClickersStats,
    getAvailableClickersStats,

    createClicker,
    
    updateClickerById,
    restoreClickerById,

    deleteClickerById,
};