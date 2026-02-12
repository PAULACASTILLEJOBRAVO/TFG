const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:response');

//Define response schema
const responseSchema = new Schema({
    answer: { 
        type: String, 
        required: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    isCorrect: { 
        type: Boolean, 
        required: true 
    },
    timeTaken: { 
        type: Number, // Time taken to answer in seconds
        required: true 
    },
    pointsAwarded: { 
        type: Number, 
        required: true 
    },

    //Relations
    playerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    sessionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Session',
        required: true 
    },
    questionId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question',
        required: true 
    }, 
    // questionClickerId: {
    //     type: Number,
    //     required: true
    // },
    //studentQuestioId: { 
    //    type: mongoose.Schema.Types.ObjectId,
    //    required: true 
    //}, //Unique identifier for all of a student's answers to the same question

    //states and configuration
    // attemptNumber: { 
    //     type: Number,
    //     default: 1
    // },
    // isFirstAttempt: { 
    //     type: Boolean,
    //     default: true
    // },
    // isFinalAttempt: { 
    //     type: Boolean,
    //     default: false
    // },
}, { 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Response' // Specify the collection name
});

// Pre-save hook to automatically set 'isFinalAttempt' based on 'attemptNumber'
responseSchema.pre('save', function(next) {
    // If this is the first attempt, mark as final attempt
    if (this.attemptNumber === 1) {
        this.isFinalAttempt = true;
    } else {
        // For any other attempt number, mark as not final
        this.isFinalAttempt = false;
    }
    next();
});

//Export the model
module.exports = mongoose.model('Response', responseSchema);