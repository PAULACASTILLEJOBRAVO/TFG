const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:course');

const {validateTeacherRole} = require('../middleware/validationRole');

//Define course schema
const courseSchema = new Schema({
    title: { 
        type: String, 
        required: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    description: { 
        type: String, 
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    category: { 
        type: String, 
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },

    //Relations
    teacherId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    studentIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    quizIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz' 
    }],

    //States and configuration
    isActive: { 
        type: Boolean, 
        default: false  // true = published, false = draft
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
    maxStudents: { 
        type: Number, 
        default: 30 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Course' // Specify the collection name
}); 

// Indexes
courseSchema.index({ title: 1 }); // Ascending index on name
courseSchema.index({ teacherId: 1 }); // Ascending index on teacherId
courseSchema.index({ isDeleted: 1 }); // Ascending index on isDeleted
courseSchema.index({ title: 'text' });
courseSchema.index({ title: 1, teacherId: 1 }, { unique: true, background: true }); // Unique index to prevent duplicate course titles for the same teacher

// Query helper to exclude soft-deleted docs easily
courseSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Instance method to soft-delete
courseSchema.methods.softDelete = async function({ by = null, reason = null } = {}) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.isActive = false; // Set isActive = false so course can't be used
  
  if (by) this.deletedBy = by;
  if (reason) this.deleteReason = reason;

  return this.save();
};

// Instance method to restore
courseSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  this.deleteReason = null;
  this.isActive = true; // or leave it as previous state if you track it

  return this.save();
};

// Static helper to soft-delete by id (useful in services)
courseSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const course = await this.findById(id);
  
  if (!course) return false;
  
  await course.softDelete({ by, reason });

  return true;
};

// Static restore by id
courseSchema.statics.restoreById = async function(id) {
  const course = await this.findById(id);
  
  if (!course) return false;

  await course.restore();

  return true;
};

// Method to add a student to the course with validation
courseSchema.methods.addStudent = async function(studentId) {
  if (this.isDeleted) throw new Error('Cannot enroll students in a deleted course');

  if (!this.isActive) throw new Error('Cannot enroll students in an inactive course');

  if (this.studentIds.includes(studentId)) throw new Error('Student is already enrolled in this course');

  if (this.studentIds.length >= this.maxStudents) throw new Error('Maximum number of students reached');

  this.studentIds.push(studentId);

  await this.save();

  return this;
};

// Method to remove a student
courseSchema.methods.removeStudent = async function(studentId) {
  this.studentIds = this.studentIds.filter(id => id.toString() !== studentId.toString());

  await this.save();

  return this;
};

// Soft-delete related quizzes before deleting the course
courseSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const Quiz = mongoose.model('Quiz');
        debug(`Pre deleteOne hook triggered for Course: ${this._id}`);

        // Search for quizzes associated with this course
        const quizzes = await Quiz.find({ courseId: this._id });

        if (!quizzes || quizzes.length === 0) {
            debug('No quizzes linked to this course.');
            return next();
        }

        // Go through each quiz and decide whether to delete it or not
        for (const quiz of quizzes) { // Iterate through quizzes
            if (quiz.isPublic === 'private') { // Only soft-delete private quizzes
                debug(`Soft-deleting private quiz: ${quiz._id}`);

                await quiz.softDelete({
                    by: this.deletedBy || null,
                    reason: 'Parent course deleted'
                });
            } else { // Skip public quizzes
                debug(`Skipping public quiz: ${quiz._id}`);
            }
        }

        next();
    } catch (err) {
        console.error('Error in pre deleteOne hook:', err);
        next(err);
    }
});


//Pre-save hook to validate that the teacherId corresponds to a user with the 'teacher' role
courseSchema.pre('save', async function(next) {
    try{
        await validateTeacherRole(this.teacherId);
        debug('Teacher role validated for teacherId.');
        next();
    }catch(err){
        debug(Error,'Error in pre-save hook: ', err);
        next(err);
    }
});

//Export the model
module.exports = mongoose.model('Course', courseSchema);