const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const debug = require('debug')('backend:models:user');

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
    lastLogin: { 
        type: Date 
    }, 
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

// Static helper to soft-delete by id (useful in services)
userSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const user = await this.findById(id);
  
  if (!user) return false;
  
  await user.softDelete({ by, reason });

  return true;
};

// Static restore by id
userSchema.statics.restoreById = async function(id) {
  const user = await this.findById(id);
  
  if (!user) return false;

  await user.restore();

  return true;
};

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
    // Case 1: Soft-delete
    if (this.isModified('isDeleted') && this.isDeleted === true) {   // Only act if the user is being soft-deleted
      const Course = mongoose.model('Course');
      const Quiz = mongoose.model('Quiz');
      const Session = mongoose.model('Session');

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
    if (this.isModified('isDeleted') && this.isDeleted === false) {
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