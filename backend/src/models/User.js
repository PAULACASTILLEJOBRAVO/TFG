const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const debug = require('debug')('backend:models:user');
const jwt = require('jsonwebtoken');

// Import constants
const { getUserEditableFields } = require('../utils/checkRolePermissions');

// Import utils functions
const { validatePasswordChange } = require('../utils/validateChange');

// Define the number of salt rounds for bcrypt
const SALT_WORK_FACTOR = 10;

//Define user schema
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,               // Convert the value to lowercase before saving in the database
        trim: true,                    // Delete spaces before and after the value before saving in the database
    },
    password: { 
        type: String, 
        required: true,
        select: false,                   // Exclude the password field from query results by default
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student',
    },

    //Secundary optional data
    fullname: { 
        type: String, 
        trim: true 
    },
    profilePicture: { 
        type: String, // Base64-encoded image
        trim: true,
        select: false, // Exclude the profilePicture field from query results by default 
    },

    //States and configuration
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    },
    isOnline: {
        type: Boolean,
    },
    lastLoginAt: { 
        type: Date 
    }, 
    lastLogoutAt: {
      type: Date
    }
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'User' // Specify the collection name
}); 

// Indexes  
userSchema.index({ fullname: 'text' });

// Query helper to exclude soft-deleted docs easily
userSchema.query.notDeleted = function() {
  debug('Applying notDeleted query helper');
  return this.where({ status: { $ne: 'inactive' } });
};

// Instance method to soft-delete
userSchema.methods.softDelete = async function() {
  debug('Soft-deleting user:', this._id);
  this.status = 'inactive';

  debug('User status set to inactive, saving user...');
  return this.save();
};

// Instance method to restore
userSchema.methods.restore = async function() {
  debug('Restoring user:', this._id);
  this.status = 'active';

  debug('User status set to active, saving user...');
  return this.save();
};

// Generate authentication token
userSchema.methods.generateAuthToken = async function() {
  try{
    const secretKey = process.env.JWT_SECRET;
    
    const token = jwt.sign({
      _id: this._id,
      username: this.username,
      role: this.role,
      email: this.email,
    }, 
    secretKey, 
    { 
      expiresIn: '24h' // Token valid for 24 hours
    });   

    return token;  
  }catch(error){
    throw new Error('Error generating auth token: ' + error.message);
  }
}

// Instance method to online user
userSchema.methods.markOnline = async function () {
  debug('Marking user as online:', this._id);
  this.isOnline = true;
  this.lastLoginAt = new Date();

  debug('User marked as online, saving user...');
  await this.save();
};

// Instance method to ofline user
userSchema.methods.markOffline = async function () {
  debug('Marking user as offline:', this._id);
  this.isOnline = false;
  this.lastLogoutAt = new Date();
  
  debug('User marked as offline, saving user...');
  await this.save();
};

// Statics helper to mark all users offline
userSchema.statics.markUserOffline = async function (id) {
  debug('Marking user as offline by ID:', id);
  const user = await this.findById(id);
  if (!user) return false;

  debug('User found for marking offline:', user);
  await user.markOffline();

  debug('User marked as offline successfully');
  return true;
}

// Statics helper to soft-delete by id (useful in services)
userSchema.statics.softDeleteById = async function(id) {
  debug('Soft-deleting user with ID:', id);

  const user = await this.findById(id);
  if (!user) return false;
  debug('User found for soft-deletion:', user);
  
  if(user.status === 'inactive') return false;
  debug('User is active, proceeding with soft-deletion');

  await user.softDelete();
  debug('User soft-deleted successfully');

  return true;
};

// Statics restore by id
userSchema.statics.restoreById = async function(id) {
  debug('Restoring user with ID:', id);

  const user = await this.findById(id);
  if (!user) return false;
  debug('User found for restoration:', user);

  if(user.status === 'active') return false;
  debug('User is inactive, proceeding with restoration');

  await user.restore();
  debug('User restored successfully');

  return user;
};

// Statics update by id
userSchema.statics.updateById = async function(id, body, currentUserData) {
    debug('Updating user with ID:', id, 'by user:', currentUserData);
    const user = await this.findById(id);
    if (!user) return false;
    debug('User found for update:', user);

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 
    debug('Current user ID:', currentUserId, 'Current user role:', currentUserRole);

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === id.toString(); 
    debug('Is self-update:', isSelf);

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getUserEditableFields(currentUserRole, isSelf);
    debug('Allowed fields for update based on role and self-update:', allowedFields);

    // Filter body to only include allowed fields
    const updates = {};
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            updates[key] = body[key];
        }
    }

    debug('Allowed fields for update:', allowedFields);

    // Apply changes
    Object.assign(user, updates);
    debug('User after applying updates:', user);

    // Save and return updated user
    debug('Saving updated user...');
    await user.save();

    return user;
}

// Statics update password by id
userSchema.statics.updatePasswordById = async function (id, body, currentUserData) {
    debug('Updating password for user with ID:', id, 'by user:', currentUserData);
    const user = await this.findById(id);
    if(!user) return false;
    debug('User found for password update:', user);

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData;
    debug('Current user ID:', currentUserId, 'Current user role:', currentUserRole);

    // Check if the user is updating their own password
    const isSelf = currentUserId.toString() === id.toString();
    debug('Is self-password update:', isSelf);

    // Extract old and new passwords from body
    const { oldPassword, newPassword } = body;
    debug('Old password provided:', !!oldPassword, 'New password provided:', !!newPassword);

    // Validate password change
    await validatePasswordChange({isSelf, currentUserRole, oldPassword, userPasswordHash: user.password});
    debug('Password change validated successfully');

    // Set new password
    debug('Setting new password for user...');
    user.password = newPassword;
    await user.save();  // Triggers pre-save hook to hash the password

    return user;
}

//Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
    debug('Pre-save hook triggered for user:', this._id);
    const user = this;

    //Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
    debug('Password field modified, hashing password...');

    //Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
    //Hash the password using the generated salt
        return bcrypt.hash(user.password, salt)
    }).then(hash =>{
        //Override the plain text password with the hashed one
        user.password = hash;
        debug('Password encrypted.');
        next();
    }).catch(err => next(err));
});

//Method to compare a given password with the database hash
userSchema.methods.comparePassword = async function(candidatePassword) {
    debug('Comparing password...');
    return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook to cascade actions when user is soft-deleted
userSchema.pre('save', async function(next) {
  try {
    const Quiz = mongoose.model('Quiz');
    const Session = mongoose.model('Session');
    const Clicker = mongoose.model('Clicker');
    
      // Case 1: Soft-delete
    if (this.isModified('status') && this.status === 'inactive' && this.role !== 'student') {   // Only act if the user is being soft-deleted
      debug('User is being soft-deleted, applying cascade actions for user:', this._id);

      // Mark quizzes created by this user as inactive
      await Quiz.updateMany(
        { teacherId: this._id }, 
        { status: 'archived' }
      );
      debug(`Quizzes created by user ${this._id} marked as archived.`);

      // Mark sessions created by this user as archived
      await Session.updateMany(
        { teacherId: this._id, status: { $in: ['active', 'paused'] } }, 
        { status: 'archived', endTime: new Date() }
      );
      debug(`Sessions created by user ${this._id} marked as archived.`);

      debug(`Soft-delete cascade applied for user ${this._id}`);
    }

    if (this.isModified('status') && this.status === 'inactive' && this.role === 'student') {
      debug('User is being soft-deleted and is a student, applying cascade actions for user:', this._id);

      // Mark clickers assigned to this student as available
      await Clicker.updateMany(
        { assignedToUserId: this._id }, 
        { $set: { assignedToUserId: null, status: 'available' } }
      );
      debug(`Clickers assigned to user ${this._id} marked as available.`);

      debug(`Soft-delete cascade applied for student user ${this._id}`);
    }

    // Case 2: Restore
    if (this.isModified('status') && this.status === 'active' && this.role !== 'student') {
      debug('User is being restored, applying cascade actions for user:', this._id);
      
      await Quiz.updateMany(
        { teacherId: this._id },
        { status: 'draft' }
      );
      debug(`Quizzes created by user ${this._id} marked as draft.`);  

      debug(`Restore cascade applied for user ${this._id}`);
    }

    next();
  } catch (err) {
    debug('Error during user soft-delete cascade:', err);
    next(err);
  }
});

//Export the model
module.exports = mongoose.model('User', userSchema);