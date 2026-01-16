const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const debug = require('debug')('backend:models:user');
const jwt = require('jsonwebtoken');

// Import constants
const { getUserEditableFields } = require('../utils/checkRolePermissions');

// Import utils functions
const { validatePasswordChange, validateEmailChange } = require('../utils/validateChange');
const { validateAdminRole, validateTeacherRole } = require('../middleware/validationRole');

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
        required: true 
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },

    //Secundary optional data
    fullname: { 
        type: String, 
        trim: true 
    },
    // profilePicture: { 
    //     type: String, // Base64-encoded image
    //     trim: true 
    // },

    //States and configuration
    isActive: { 
        type: Boolean,  // usable account
        default: true 
    },
    isDeleted: {
        type: Boolean,  // soft deleted flag
        default: false, 
        index: true,
    },
    deletedAt: { 
        type: Date 
    },
    deletedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User', // who performed the deletion
    },
    deleteReason: {
        type: String,
        trim: true,
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
// userSchema.index({ email: 1 }, { unique: true, background: true });
// userSchema.index({ username: 1 }, { unique: true, background: true });
userSchema.index({ fullname: 'text' });

// Query helper to exclude soft-deleted docs easily
userSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Instance method to soft-delete
userSchema.methods.softDelete = async function({ by = null, reason = null } = {}) {
  this.isDeleted = true;
  this.deletedAt = new Date();

  if (by) this.deletedBy = by;
  if (reason) this.deleteReason = reason;

  // optionally also set isActive = false so account can't login
  this.isActive = false;
  return this.save();
};

// Instance method to restore
userSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  this.deleteReason = null;
  this.isActive = true; // or leave it as previous state if you track it

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
      email: this.email
    }, 
    secretKey, 
    { 
      expiresIn: '7d' //'1h' // Token valid for 1 hour
    });   

    return token;  
  }catch(error){
    throw new Error('Error generating auth token: ' + error.message);
  }
}

// Instance method to online user
userSchema.methods.markOnline = async function () {
  this.isOnline = true;
  this.lastLoginAt = new Date();
  await this.save();
};

// Instance method to ofline user
userSchema.methods.markOffline = async function () {
  this.isOnline = false;
  this.lastLogoutAt = new Date();
  await this.save();
};

// Statics helper to soft-delete by id (useful in services)
userSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const user = await this.findById(id);

  if (!user) return false;
  
  await user.softDelete({ by, reason });

  return true;
};

// Statics restore by id
userSchema.statics.restoreById = async function(id) {
  const user = await this.findById(id);

  if (!user) return false;
  if(user.isActive) return false;

  await user.restore();

  return user;
};

// Statics permissions to create new user 
userSchema.statics.canCreateUser = async function(currentUser) {
  return await validateAdminRole(currentUser);
}

// Statics permissons to fetch total users
userSchema.statics.canGetAdminStats = async function(currentUser) {
  return await validateAdminRole(currentUser);
}

// Statics permissions to fetch total students
userSchema.statics.canGetTeacherStats = async function(currentUser) {
  return await validateTeacherRole(currentUser);
}

// Statics update by id
userSchema.statics.updateById = async function(id, body, currentUserData) {
    const user = await this.findById(id).select('-password');
    if (!user) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === id.toString(); 

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getUserEditableFields(currentUserRole, isSelf);

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

    // Save and return updated user
    await user.save();

    return user;
}

// Statics update password by id
userSchema.statics.updatePasswordById = async function (id, body, currentUserData) {
    const user = await this.findById(id);
    if(!user) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData;

    // Check if the user is updating their own password
    const isSelf = currentUserId.toString() === id.toString();

    // Extract old and new passwords from body
    const { oldPassword, newPassword } = body;

    // Validate password change
    await validatePasswordChange({isSelf, currentUserRole, oldPassword, userPasswordHash: user.password});

    // Set new password
    user.password = newPassword;
    await user.save();  // Triggers pre-save hook to hash the password

    return user;
}

// Statics update email by id
userSchema.statics.updateEmailById = async function (id, body, currentUserData) {
  const user = await this.findById(id).select('-password'); // Ensure password is not selected
    if(!user) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData;

    // Check if the user is updating their own email
    const isSelf = currentUserId.toString() === id.toString();

    // Extract old and new email from body
    const { oldEmail, newEmail } = body;

    // Validate email change
    await validateEmailChange({isSelf, currentUserRole, oldEmail, userEmail: user.email});

    // Set the new email
    user.email = newEmail;
    await user.save();  

    return user;
}

// Statics update role by id
userSchema.statics.updateRoleById = async function (id, newRole, currentUserData) {
    if(currentUserData.role !== 'admin')  throw new Error('Only admins can change user roles');

    const user = await this.findById(id).select('-password');
    if(!user) return false;

    // Validate new role
    if(!['student','teacher','admin'].includes(newRole)) throw new Error('Invalid role');

    // Set new role
    user.role = newRole;
    await user.save();

    return user;
}

// Statics method status by id
userSchema.statics.updateStatusById = async function (id, newStatus, currentUserData) {
    const { role } = currentUserData;

    if(role !== 'admin' && role !== 'teacher') throw new Error('Only admins and teachers can change user status');

    const user = await this.findById(id).select('-password');
    if(!user) return false;

    if(typeof newStatus !== 'boolean') throw new Error('Status must be true or false');

    // If soft-deleted, restore before updating status
    if (user.isDeleted && newStatus === true) {
        await user.restore();
    }

    // Set new status
    user.isActive = newStatus;
    await user.save();

    return user;
}

//Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
    const user = this;

    //Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

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
    debug('Comparing password...')
    return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save hook to cascade actions when user is soft-deleted
userSchema.pre('save', async function(next) {
  try {
    const Course = mongoose.model('Course');
    const Quiz = mongoose.model('Quiz');
    const Session = mongoose.model('Session');
    
      // Case 1: Soft-delete
    if (this.isModified('isDeleted') && this.isDeleted === true && this.role !== 'student') {   // Only act if the user is being soft-deleted
      // Mark courses taught by this user as inactive
      await Course.updateMany(
        { teacherId: this._id },
        { isActive: false }
      );

      // Mark quizzes created by this user as inactive
      await Quiz.updateMany(
        { teacherId: this._id, isPublic: "private" }, // Only non-public quizzes
        { isActive: false }
      );

      // Mark sessions created by this user as archived
      await Session.updateMany(
        { teacherId: this._id, status: { $in: ['pedding', 'active', 'paused'] } }, 
        { status: 'archived', endTime: new Date() }
      );

      debug(`Soft-delete cascade applied for user ${this._id}`);
    }

    // Case 2: Restore
    if (this.isModified('isDeleted') && this.isDeleted === false && this.role !== 'student') {
      await Course.updateMany(
        { teacherId: this._id },
        { isActive: true }
      );
      
      await Quiz.updateMany(
        { teacherId: this._id },
        { isActive: true }
      );

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