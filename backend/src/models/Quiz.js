const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:quiz');

const {validateTeacherRole} = require('../middleware/validationRole');

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
    courseId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course',
        required: true 
    },
    questionIds: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }],

    //States and configuration
    isActive: { 
        type: Boolean, 
        default: false 
    },
    // timeLimit: { 
    //     type: Number, // Time limit in minutes
    //     default: 30 
    // },
    // totalScore: {
    //     type: Number,
    //     default: 0
    // },
    // attemptAllowed: {
    //     type: Number,
    //     default: 1
    // },
    dificulty: { 
        type: String, 
        enum: ['easy', 'medium', 'hard'], 
        default: 'medium' 
    },

    //Access control
    isPublic: { 
        type: String, 
        enum: ['private', 'public'], 
        default: 'private' 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Quiz' // Specify the collection name
});

//Pre-save hook to validate that the creatorId corresponds to a user with the 'teacher' role
quizSchema.pre('save', async function(next) {
    try{
        await validateTeacherRole(this.creatorId);
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