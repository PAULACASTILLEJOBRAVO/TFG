const mongoose = require('mongoose');
const debug = require('debug')('backend:middleware:validationRole');
const Schema = mongoose.Schema;

//Define session schema
const sessionSchema = new Schema({
    //Relations
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    playerIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz',
        required: true 
    },
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course' 
    },
    // currentQuestionId: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Question' 
    // }, // To track the current question being asked in the session

    //States and configuration
    startTime: { 
        type: Date,
        default: Date.now,
        required: true 
    },
    endTime: { 
        type: Date 
    },
    status: { 
        type: String, 
        enum: ['pending', 'active', 'completed', 'paused', 'cancelled', 'archived'], 
        default: 'pending' 
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    }, // Soft delete flag
    deletedAt: { 
        type: Date 
    }, // Timestamp for when the session was soft deleted
    deletedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, // User who performed the deletion
    deleteReason: { 
        type: String 
    }, // Reason for deletion

    // Additional features (commented out for future use)
    // isLive: { 
    //     type: Boolean, 
    //     default: false 
    // }, // Indicates if the session is currently live
    // allowLateJoin: { 
    //     type: Boolean, 
    //     default: true 
    // }, // Allow players to join after the session has started
    //resultsGenerated: { 
    //     type: Boolean, 
    //     default: false 
    // } // Indicates if the results have been generated for the session
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Session' // Specify the collection name
});

// Indexes
sessionSchema.index({ teacherId: 1 });
sessionSchema.index({ quizId: 1 });
sessionSchema.index({ courseId: 1 });
sessionSchema.index({ status: 1 });

sessionSchema.index({ status: "text"});

// Query helper to exclude soft-deleted docs easily
sessionSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Instance method to start the session
sessionSchema.methods.startSession = async function() {
    if(this.status !== 'pending') throw new Error('Only pending sessions can be started.');

    if(this.status === 'active') return debug(`Session ${this}._id} is already active.`);

    this.status = 'active';
    this.startTime = new Date();
    await this.save();

    debug(`Session ${this._id} started.`);
}

// Instance method to pause the session
sessionSchema.methods.pauseSession = async function() {
    if(this.status !== 'active') throw new Error('Only active sessions can be paused.');
    
    if(this.status === 'paused') return debug(`Session ${this}._id} is already paused.`);

    this.status = 'paused';
    await this.save();

    debug(`Session ${this._id} paused.`);
}

// Instance method to resumed the session
sessionSchema.methods.resumeSession = async function() {
    if(this.status !== 'paused') throw new Error('Only paused sessions can be resumed.');
    
    if(this.status === 'active') return debug(`Session ${this}._id} is already active.`);

    this.status = 'active';
    await this.save();
    
    debug(`Session ${this._id} resumed.`);
}

// Instance method to completed the session
sessionSchema.methods.completeSession = async function() {
    if(this.status !== 'active' && this.status !== 'paused') throw new Error('Only active or paused sessions can be completed.');
    
    if(this.status === 'completed') return debug(`Session ${this}._id} is already completed.`);

    this.status = 'completed';
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} completed.`);
}

// Instance method to cancel the session
sessionSchema.methods.cancelSession = async function(reason = null) {
    if(this.status !== 'pending' && this.status !== 'active' && this.status !== 'paused') throw new Error('Only pending, active or paused sessions can be cancelled.');

    if(this.status === 'cancelled') return debug(`Session ${this}._id} is already cancelled.`);

    this.status = 'cancelled';
    if(reason) this.cancelReason = reason;
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} cancelled.`);
}

// Instance method to archived the session
sessionSchema.methods.archiveSession = async function() {
    if(this.status === 'archived') return debug(`Session ${this}._id} is already archived.`);

    this.status = 'archived';
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} archived.`);
}

// Instance method to delete the session
sessionSchema.methods.softDelete = async function({by = null, reason = null} = {}) {
    this.isDeleted = true;
    this.deletedAt = new Date();

    if(by) this.deletedBy = by;
    if(reason) this.deleteReason = reason;

    // If it is not finished, archive it
    if(!this.status === 'completed' && !this.status === 'cancelled' && !this.status === 'archived'){
        this.status = 'archived';
        this.endTime = new Date();
    }

    await this.save();
    debug(`Session ${this._id} soft-deleted.`);
};

// Instance method to restore the session
sessionSchema.methods.restore = async function() {
    this.isDeleted = false;
    this.deletedAt = null;
    this.deletedBy = null;
    this.deleteReason = null;

    await this.save();
    debug(`Session ${this._id} restored.`);
};

// Static helper to soft-delete by id (useful in services)
sessionSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const session = await this.findById(id);
  
  if (!session) return false;
  
  await session.softDelete({ by, reason });

  return true;
};

// Static restore by id
sessionSchema.statics.restoreById = async function(id) {
  const session = await this.findById(id);
  
  if (!session) return false;

  await session.restore();

  return true;
};

// Static complete by id
sessionSchema.statics.completeById = async function(id){
    const session = await this.findById(id);

    if(!session) return false;

    await session.completeSession();

    return true;
}

// Static cancel by id
sessionSchema.statics.cancelById = async function(id, reason = null){
    const session = await this.findById(id);

    if(!session) return false;

    await session.cancelSession(reason);

    return true;
}

// Static archive by id
sessionSchema.statics.archiveById = async function(id){
    const session = await this.findById(id);
    
    if(!session) return false;

    await session.archiveSession();
    
    return true;
}

// Static start by id
sessionSchema.statics.startById = async function(id){
    const session = await this.findById(id);

    if(!session) return false;

    await session.startSession();

    return true;
}

// Static pause by id
sessionSchema.statics.pauseById = async function(id){
    const session = await this.findById(id);

    if(!session) return false;

    await session.pauseSession();

    return true;
}

//Export the model
module.exports = mongoose.model('Session', sessionSchema);