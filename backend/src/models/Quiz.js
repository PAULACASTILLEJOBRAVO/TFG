const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:quiz');

const {validateTeacherRoleById, validateTeacherRole} = require('../middleware/validationRole');
const { getQuizEditableFields } = require('../utils/checkRolePermissions');

//Define quiz schema
const quizSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    description: { 
        type: String, 
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    
    //Relations
    creatorId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    // courseId: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Course',
    // },
    questionIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }],
    playerIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],

    //States and configuration
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isActive: { 
        type: Boolean, 
        default: false 
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: { 
        type: Date 
    },
    deletedBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    deleteReason: { 
        type: String, 
        trim: true 
    },
    difficulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'], 
        default: 'easy' 
    },

    //Access control
    // isPublic: { 
    //     type: String, 
    //     enum: ['private', 'public'], 
    //     default: 'private' 
    // },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Quiz' // Specify the collection name
});

// Indexes
quizSchema.index({ title: 1 });
quizSchema.index({ creatorId: 1 });
quizSchema.index({ isDeleted: 1 });
quizSchema.index({ title: 'text' });

// Query helper to exclude soft-deleted docs easily
quizSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Instance method to soft-delete
quizSchema.methods.softDelete = async function({ by = null, reason = null } = {}) {
  if (this.isPublic === 'public') throw new Error('Cannot delete a public quiz.');

  this.isDeleted = true;
  this.status = 'archived'; // Set status to archived when deleted
  this.deletedAt = new Date();
  this.isActive = false; // Set isActive = false so quiz can't be used

  if (by) this.deletedBy = by;
  if (reason) this.deleteReason = reason;

  return this.save();
};

// Instance method to restore
quizSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  this.deleteReason = null;
  this.isActive = true; // or leave it as previous state if you track it
  this.status = 'draft'; // Set status to draft when restored, or keep previous status if you track it

  return this.save();
};

// Instance method to publish
quizSchema.methods.publish = async function() {
    this.status = 'published';
    this.isActive = true; // Set isActive = true so quiz can be used

    return this.save();
}

// Static helper to soft-delete by id (useful in services)
quizSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const quiz = await this.findById(id);
  
  if (!quiz) return false;
  if (quiz.isPublic === 'public') throw new Error('Cannot delete public quizzes');
  
  await quiz.softDelete({ by, reason });

  return true;
};

// Static restore by id
quizSchema.statics.restoreById = async function(id) {
  const quiz = await this.findById(id);
  
  if (!quiz) return false;

  await quiz.restore();

  return true;
};

// Static publish by id
quizSchema.statics.publishById = async function(id) {
    const quiz = await this.findById(id);
  
    if (!quiz) return false;

    await quiz.publish();

    return true;
}

// Static update by id
quizSchema.statics.updateById = async function(id, body, currentUserData, session) {
    const quiz = await this.findById(id).session(session);
  
    if (!quiz) return false;

    // Extract current user ID and role
    const { _id: currentUserId, role: currentUserRole } = currentUserData; 

    // Check if the user is updating their own data
    const isSelf = currentUserId.toString() === quiz.creatorId.toString(); 

    // Get allowed fields based on role and whether it's self-update
    const allowedFields = getQuizEditableFields(currentUserRole, isSelf);

    // Filter body to only include allowed fields
    const updates = {};
    for (const key of Object.keys(body)) {
        if (allowedFields.includes(key)) {
            updates[key] = body[key];
        }
    }

    debug('Allowed fields for update:', allowedFields);

    // Apply changes
    Object.assign(quiz, updates);

    // Save and return updated quiz
    await quiz.save({session});

    return quiz;
}

// Statics permissions to fetch total quizzes for a teacher
quizSchema.statics.canGetTeacherQuizzes = async function(currentUser) {
    return await validateTeacherRole(currentUser);
}

// Soft-delete related questions before deleting the quiz
quizSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        if (this.isPublic === 'public') { // If the quiz is public, prevent its deletion
            const err = new Error('Cannot delete a public quiz.');
            err.status = 403;
            return next(err); // Abort the operation
        }

        const Question = mongoose.model('Question');
        debug(`Pre deleteOne hook triggered for Quiz: ${this._id}`);

        // Search for questions associated with this quiz
        const questions = await Question.find({ quizId: this._id });

        if (!questions || questions.length === 0) {
            debug('No questions linked to this quiz.');
            return next();
        }

        // Go through each question and decide whether to delete it or not
        for (const question of questions) { // Iterate through questions
            if (!question.isReusable) { // Only soft-delete not reusable questions
                debug(`Soft-deleting private question: ${question._id}`);

                await question.softDelete({
                    by: this.deletedBy || null,
                    reason: 'Parent quiz deleted'
                });
            } else { // Omit reusable questions
                debug(`Omiting reusable question: ${question._id}`);
            }
        }

        next();
    } catch (err) {
        console.error('Error in pre deleteOne hook:', err);
        next(err);
    }
});

//Pre-save hook to validate that the creatorId corresponds to a user with the 'teacher' role
quizSchema.pre('save', async function(next) {
    try{
        await validateTeacherRoleById(this.creatorId);
        debug('Teacher role validated for creatorId');
        next();
    }catch(err){
        debug(Error,'Error in pre-save hook: ', err);
        next(err);
    }
});

//Calculate totalScore before saving
// quizSchema.pre('save', async function(next) {
//     if(this.questionIds && this.questionIds.length > 0){
//         const questions = await Question.find({_id: {$in: this.questionIds}});
//         this.totalScore = questions.reduce((total, question) => total + (question.points || 0), 0);
//     }
//     next();
// });

//Export the model
module.exports = mongoose.model('Quiz', quizSchema);