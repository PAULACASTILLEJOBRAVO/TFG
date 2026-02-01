const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:question');

//Define question schema
const questionSchema = new Schema({
    text: { 
        type: String, 
        required: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    type: { 
        type: String, 
        enum: ['multiple-choice', 'true-false'],    // Define the type of question
        default: 'multiple-choice',
        required: true
    },
    options: [{ 
        text: {
            type: String, 
            required: true
        }, // Visible text of the option
        isCorrect: {
            type: Boolean, 
            required: true
        }, // Indicates if the option is correct
        order: {
            type: Number, 
            required: true
        }, // Order of the option in the list
        feedback: {
            type: String, 
            trim: true
        } // Feedback for the option
    }], // Array of options for multiple-choice and true-false questions
    correctOptions: [
        { 
            type: Number,
            // required: true
        }
    ], // Correct options for multiple-choice and true-false questions

    //States and configuration
    isActive: {             // true = published, false = draft
        type: Boolean, 
        default: true 
    },
    isReusable: {           // Can be used in multiple quizzes
        type: Boolean, 
        default: true 
    },
    isPublic: {
        type: Boolean,
        default: false // true = shared with all teachers, false = private to creator
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
    points: { 
        type: Number, 
        default: 10,
        min: 0
    },
    timeLimit: { 
        type: Number, // Time limit in seconds
        default: 60,
        min: 10
    },
    allowMultipleSelections: { // Only for multiple-choice questions
        type: Boolean, 
        default: false 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Question' // Specify the collection name
});

// Indexes
questionSchema.index({ text: 1 });
questionSchema.index({ isDeleted: 1 });
questionSchema.index({ text: 'text' });

// Query helper to exclude soft-deleted docs easily
questionSchema.query.notDeleted = function() {
  return this.where({ isDeleted: false });
};

// Instance method to soft-delete
questionSchema.methods.softDelete = async function({ by = null, reason = null } = {}) {
  this.isDeleted = true;
  this.deletedAt = new Date();

  if (by) this.deletedBy = by;
  if (reason) this.deleteReason = reason;

  // optionally also set isActive = false so question can't be used
  this.isActive = false;
  return this.save();
};

// Instance method to restore
questionSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedAt = null;
  this.deletedBy = null;
  this.deleteReason = null;
  this.isActive = true; // or leave it as previous state if you track it

  return this.save();
};

// Static helper to soft-delete by id (useful in services)
questionSchema.statics.softDeleteById = async function(id, { by = null, reason = null } = {}) {
  const question = await this.findById(id);
  
  if (!question) return false;
  
  await question.softDelete({ by, reason });

  return true;
};

// Static restore by id
questionSchema.statics.restoreById = async function(id) {
  const question = await this.findById(id);
  
  if (!question) return false;

  await question.restore();

  return true;
};


//Order options before saving
questionSchema.pre('save', function(next) {
    const question = this;
    debug('Pre-save hook triggered for question: ', question._id);

    if(question.options && question.options.length > 0){
        //Assign order if missing
        question.options.forEach((option, index) => {
            if(option.order === undefined || option.order === null){
                option.order = index + 1;
            }
        });

        //Sort options by order
        question.options.sort((a, b) => a.order - b.order);
        debug('Options ordered before saving.');
    }

    next();
});

//Export the model
module.exports = mongoose.model('Question', questionSchema);