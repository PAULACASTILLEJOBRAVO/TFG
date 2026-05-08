const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:quiz');

const { validateAdminRoleById } = require('../middleware/validationRole');

const { getClickerEditableFields } = require('../utils/checkRolePermissions');

// Define clicker schema
const clickerSchema = new Schema({
    deviceCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    // Relations
    assignedToUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    // States and configuration
    status: {
        type: String,
        enum: ['available', 'assigned', 'damaged', 'retired'],
        default: 'available'
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Clicker' // Specify the collection name
}); 

// Indexes
clickerSchema.index({ AssignedToUserId: 1 });

// Query helper to exclude deleted documents
clickerSchema.query.notDeleted = function() {
  return this.where({ status: { $ne: 'retired' } });
};

// Instance method to soft-delete
clickerSchema.methods.softDelete = async function() {
  this.status = 'retired'; // Set status to retired when deleted
  this.assignedToUserId = null; // Unassign the clicker when deleted

  return this.save();
};

// Instance method to restore
clickerSchema.methods.restore = async function() {
  this.status = 'available'; // Reset status to available when restored

  return this.save();
};

// Static helper to soft-delete by id 
clickerSchema.statics.softDeleteById = async function(id) {
  const clicker = await this.findById(id);
  if (!clicker) return false;
  
  await clicker.softDelete();

  return true;
};

// Static restore by id
clickerSchema.statics.restoreById = async function(id) {
  const clicker = await this.findById(id);
  if (!clicker) return false;

  await clicker.restore();

  return true;
};

// Statics update by id
clickerSchema.statics.updateById = async function(id, body, currentUserData) {
    const clicker = await this.findById(id);
    if (!clicker) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === id.toString(); 

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getClickerEditableFields(currentUserRole, isSelf);

    // Filter body to only include allowed fields
    const updates = {};
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            updates[key] = body[key];
        }
    }

    debug('Allowed fields for update:', allowedFields);

    // Apply changes
    Object.assign(clicker, updates);

    // Save and return updated clicker
    await clicker.save();

    return clicker;
}

//Pre-save hook to validate that the adminId corresponds to a user with the 'admin' role
clickerSchema.pre('save', async function(next) {
    try{
        await validateAdminRoleById(this.adminId);
        debug('Admin role validated for adminId.');
        next();
    }catch(err){
        debug(Error,'Error in pre-save hook: ', err);
        next(err);
    }
});

// Export the model
module.exports = mongoose.model('Clicker', clickerSchema);