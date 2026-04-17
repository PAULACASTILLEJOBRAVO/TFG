const mongoose = require('mongoose');
const debug = require('debug')('backend:models:Session');
const Schema = mongoose.Schema;

// Import models
const Clicker = require('./Clicker');

const { 
    getSessionCompleteFields, 
    getSessionEditableFields 
} = require('../utils/checkRolePermissions');

//Define session schema
const sessionSchema = new Schema({
    //Relations
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    deviceIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Clicker' 
    }],
    quizId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz',
        required: true 
    },
    questions: [{
        originalQuestionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
        questionSnapshot: {
            text: { type: String, required: true },
            type: { 
                type: String, 
                enum: ['multiple-choice', 'true-false'], 
                required: true 
            },
            points: { type: Number },
            timeLimit: { type: Number  },
            options: [{
                letter: { type: String, required: true },
                text: { type: String, required: true },
                isCorrect: { type: Boolean, required: true }
            }]
        },
        answers: [{
            letter: { type: String, required: true },
            count: { type: Number, default: 0 }
        }],
        totalResponses: { type: Number, default: 0 }
    }],

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
        enum: ['active', 'completed', 'paused', 'cancelled', 'archived'], 
        default: 'active' 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Session' // Specify the collection name
});

// Indexes
sessionSchema.index({ teacherId: 1 });
sessionSchema.index({ quizId: 1 });
sessionSchema.index({ status: 1 });

// Query helper to exclude soft-deleted docs easily
sessionSchema.query.notDeleted = function() {
  return this.where({ status: { $ne: 'archived' } });
};

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
sessionSchema.methods.completeSession = async function({questions, endTime}) {
    debug(`Completing session ${this._id} with questions:`, questions);
    if(!questions || questions.length === 0) throw new Error(`Session ${this._id} cannot be completed without questions.`);

    debug(`Setting session ${this._id} status to completed with endTime: ${endTime}`);
    this.status = 'completed';
    this.endTime = endTime ? endTime : new Date();
    this.questions = questions;

    await this.save();
}

// Instance method to cancel the session
sessionSchema.methods.cancelSession = async function(reason = null) {
    if(this.status !== 'active' && this.status !== 'paused') throw new Error('Only active or paused sessions can be cancelled.');

    if(this.status === 'cancelled') throw new Error(`Session ${this._id} is already cancelled.`);

    this.status = 'cancelled';
    if(reason) this.cancelReason = reason;
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} cancelled.`);
}

// Instance method to archived the session
sessionSchema.methods.archiveSession = async function() {
    if(this.status === 'archived') throw new Error(`Session ${this._id} is already archived.`);

    this.status = 'archived';
    this.endTime = new Date();
    await this.save();

    debug(`Session ${this._id} archived.`);
}

// Instance method to delete the session
sessionSchema.methods.softDelete = async function() {
    // If it is not finished, archive it
    if(this.status !== 'completed' && this.status !== 'cancelled' && this.status !== 'archived'){
        this.status = 'archived';
        this.endTime = new Date();
    }

    await this.save();
    debug(`Session ${this._id} soft-deleted.`);
};

// Instance method to restore the session
sessionSchema.methods.restore = async function() {
    this.status = 'active';

    await this.save();
    debug(`Session ${this._id} restored.`);
};

// Static helper to soft-delete by id (useful in services)
sessionSchema.statics.softDeleteById = async function(id) {
  const session = await this.findById(id);
  if (!session) return false;
  
  await session.softDelete();

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
sessionSchema.statics.completeById = async function(id, body, currentUserData) {
    debug(`Completing session with ID ${id} and body:`, body);
    debug(body.questions[0].questionSnapshot); // Log the first question for more insight

    const session = await this.findById(id);
    if(!session) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 
    debug(`Current user ID: ${currentUserId}, role: ${currentUserRole}`);

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === session.teacherId.toString(); 
    debug(`Is self update: ${isSelf}`);

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getSessionCompleteFields(currentUserRole, isSelf, body.status);

    // Filter body to only include allowed fields
    const filteredBody = {};
    
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            filteredBody[key] = body[key];
        }
    }

    debug('Allowed fields for completion:', allowedFields);
    debug('Filtered body for completion:')
    debug(filteredBody);

    // Apply changes
    await session.completeSession({
        questions: filteredBody.questions,
        endTime: filteredBody.endTime
    });

    debug(`Session with ID ${id} completed successfully`);
    return session;
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

// Static pause by id
sessionSchema.statics.pauseById = async function(id){
    const session = await this.findById(id);
    if(!session) return false;

    await session.pauseSession();

    return true;
}

// Static update by id
sessionSchema.statics.updateById = async function(id, body, currentUserData) {
    debug(`Updating session with ID ${id} and body:`, body);
    const session = await this.findById(id);
    if (!session) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 
    debug(`Current user ID: ${currentUserId}, role: ${currentUserRole}`);

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === session.teacherId.toString(); 
    debug(`Is self update: ${isSelf}`);

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getSessionEditableFields(currentUserRole, isSelf, session.status);
    debug('Allowed fields for update:', allowedFields);

    const updates = {};

    // Get clicker IDs from the session's deviceIds
    if (body.deviceIds && body.deviceIds.length > 0) {
        const clickers = await Clicker.find({
            deviceCode: { $in: body.deviceIds }
        });

        if (clickers.length === 0) {
            throw new Error('No matching clickers found for deviceCodes');
        }

        body.deviceIds = clickers.map(c => c._id);
    }

    // Filter body to only include allowed fields
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            debug(`Field "${key}" is allowed for update. New value: ${JSON.stringify(body[key])}`);
            updates[key] = body[key];
        }
    }

    debug('Allowed fields for update:', allowedFields);

    // Apply changes
    Object.assign(session, updates);

    // Save and return updated session
    await session.save();

    return session;
}

//Export the model
module.exports = mongoose.model('Session', sessionSchema);