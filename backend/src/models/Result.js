const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:Result');

// Define result schema
const resultSchema = new Schema({
    totalScore: { 
        type: Number, 
        required: true 
    },
    correctAnswers: { 
        type: Number, 
        required: true 
    },
    wrongAnswers: { 
        type: Number, 
        required: true 
    },
    unansweredQuestions: { 
        type: Number, 
        required: true 
    },
    totalQuestions: { 
        type: Number, 
        required: true 
    },
    rank: { 
        type: Number, 
        required: true,
        default: 0
    },

    //Relations
    playerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User',
    },
    sessionId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Session', 
        required: true 
    },
    quizSnapshot: {
        originalQuizId: {
            type: Schema.Types.ObjectId,
            ref: 'Quiz'
        },
        title: { type: String, required: true },
        description: { type: String},
        difficulty: { type: String, required: true },
    },

    //status and configuration
    timeTaken: { 
        type: Number, // in seconds
        required: true 
    },
    startedAt: { 
        type: Date, 
        required: true 
    },
    finishedAt: { 
        type: Date, 
        required: true 
    }
}, { 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Result' // Specify the collection name
});

//Export Result model
module.exports = mongoose.model('Result', resultSchema);