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
        enum: ['active', 'completed'], 
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

// Static complete by id
sessionSchema.statics.completeById = async function(id, body, currentUserData) {
    debug(`Completing session with ID ${id} and body:`, body);
 
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