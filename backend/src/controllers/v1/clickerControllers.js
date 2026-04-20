// Import services
const clickerServices = require('../../services/v1/clickerServices');

// Import models
const Clicker = require('../../models/Clicker');

// Debug
const debug = require('debug')('backend:controllers:v1:clickerControllers');

// Clicker controllers
// Controller to get all clickers
const getAllClickers = async (req, res) => {
    try {
        debug('Fetching all clickers');
        const clickers = await clickerServices.getAllClickers();

        debug('Clickers fetched successfully');
        res.status(200).json({
            message: 'Clickers fetched successfully', 
            data: clickers
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching clickers', 
            error: error.message 
        });
    }
};

// Controller to get a clicker by ID
const getClickerById = async (req, res) => {
    debug('Fetching clicker by ID');
    const {id} = req.params;

    if (!id) return res.status(400).json({ message: 'Clicker ID is required' });
        
    try{
        debug(`Fetching clicker with ID: ${id}`);
        const clicker = await clickerServices.getClickerById(id);
        if (!clicker) return res.status(404).json({ message: 'Clicker not found' });
        
        debug('Clicker fetched successfully');
        res.status(200).json({
            message: 'Clicker fetched successfully', 
            data: clicker
        });
    } catch (error){
        res.status(500).json({ 
            message: 'Error fetching clicker', 
            error: error.message 
        });
    } 
}

// Controller to get clickers stats
const getTotalClickersStats = async (req, res) => {
    const currentUser = req.user;

    try {
        const canAccess = await Clicker.canGetAdminClickers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User authorized to access clickers stats');

        const clickers = await clickerServices.getTotalClickersStats();
        debug('Clickers stats fetched successfully');

        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
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
        const canAccess = await Clicker.canGetAdminClickers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User authorized to access clickers stats');

        const clickers = await clickerServices.getActiveClickersStats();
        debug('Clickers stats fetched successfully');

        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
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
        const canAccess = await Clicker.canGetAdminClickers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User authorized to access clickers stats');

        const clickers = await clickerServices.getInUseClickersStats();
        debug('Clickers stats fetched successfully');

        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
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
        const canAccess = await Clicker.canGetAdminClickers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User authorized to access clickers stats');

        const clickers = await clickerServices.getAvailableClickersStats();
        debug('Clickers stats fetched successfully');

        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
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
        const canAccess = await Clicker.canGetAdminClickers(currentUser);
        if(!canAccess) return res.status(403).json({message: "Unauthorized"});
        debug('User authorized to access clickers stats');

        const clickers = await clickerServices.getInactiveClickersStats();
        debug('Clickers stats fetched successfully');

        res.status(200).json({
            message: "Clickers' stats fetched successfully", 
            data: clickers
        });
    } catch (error) {
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
        const newClicker = await clickerServices.createClicker(body);

        res.status(201).json({
            message: 'Clicker created successfully', 
            data: newClicker
        });    
    } catch(error){
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

    if(!id) return res.status(400).json({ message: 'Clicker ID is required'});
    if(!by && !reason) return res.status(400).json({ message: 'Deletion metadata is required'});

    try{
        const deleted = await clickerServices.deleteClickerById(id, by, reason);

        if (!deleted) return res.status(404).json({ message: 'Clicker not found' });

        res.status(200).json({
         message: 'Clicker deleted successfully'
        });
    }catch(error){
        res.status(500).json({
            message: 'Error deleting clicker',
            error: error.message
        })
    }
}

// Controller to restore a clicker by ID
const restoreClickerById = async (req, res) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({ message: 'Clicker ID is required'});

    try{
        const restored = await clickerServices.restoreClickerById(id);

        if (!restored) return res.status(404).json({ message: 'Clicker not found' });

        res.status(200).json({
         message: 'Clicker restored successfully'
        });
    }catch(error){
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

    if(!id) return res.status(400).json({ message: 'Clicker ID is required'});
    if(!body) return res.status(400).json({ message: 'Body is required'});

    try{
        const updatedClicker = await clickerServices.updateClickerById({id, body, _id, role});

        if(!updatedClicker) return res.status(404).json({ message: 'Clicker not found'});

        res.status(200).json({
            message: 'Clicker updated successfully',
            data: updatedClicker
        })
    }catch(error){
        res.status(500).json({
            message: 'Error updating clicker',
            error: error.message
        })
    }
}

// Export controllers functions
module.exports = {
    getAllClickers,
    getClickerById,
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