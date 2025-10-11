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
        ref: 'Question' 
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
        enum: ['pending', 'active', 'completed', 'pause'], 
        default: 'pending' 
    },
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
    versionKey: false // Disable the __v version key
});

//Export the model
module.exports = mongoose.model('Session', sessionSchema);