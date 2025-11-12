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
    deleteAt: { 
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

    this.status = 'active';
    this.startTime = new Date();
    await this.save();

    debug(`Session ${this._id} started.`);
}

// Instance method to pause the session
sessionSchema.methods.resumeSession = async function() {
    if(this.status !== 'active') throw new Error('Only active sessions can be paused.');
    
    this.status = 'paused';
    await this.save();

    debug(`Session ${this._id} paused.`);
}

// Instance method to resumed the session
sessionSchema.methods.pauseSession = async function() {
    if(this.status !== 'paused') throw new Error('Only paused sessions can be resumed.');
    
    this.status = 'paused';
    await this.save();
    
    debug(`Session ${this._id} paused.`);
}

// Instance method to completed the session
sessionSchema.methods.completeSession = async function() {
    if(this.status !== 'active' && this.status !== 'paused') throw new Error('Only active or paused sessions can be completed.');
    
    this.status = 'completed';
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} completed.`);
}

// Instance method to cancel the session
sessionSchema.methods.cancelSession = async function(reason = null) {
    if(this.status !== 'pending' && this.status !== 'active' && this.status !== 'paused') throw new Error('Only pending, active or paused sessions can be cancelled.');

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
    this.deleteAt = new Date();

    if(by) this.deletedBy = by;
    if(reason) this.deleteReason = reason;

    await this.save();
    debug(`Session ${this._id} soft-deleted.`);
};

// Instance method to restore the session
sessionSchema.methods.restore = async function() {
    this.isDeleted = false;
    this.deleteAt = null;
    this.deletedBy = null;
    this.deleteReason = null;

    await this.save();
    debug(`Session ${this._id} restored.`);
};

//Export the model
module.exports = mongoose.model('Session', sessionSchema);