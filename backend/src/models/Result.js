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
        required: true
    },

    //Relations
    playerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Player', 
        required: true 
    },
    sessionId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Session', 
        required: true 
    },
    quizId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true 
    },

    //status and configuration
    status: { 
        type: String, 
        enum: ['in-progress', 'complete'], 
        default: 'in-progress' 
    },
    timeTaken: { 
        type: Number, // in seconds
        required: true 
    },
    FinishedAt: { 
        type: Date, 
        required: true 
    }
}, { 
    timestamps: true,
    versionKey: false
});

//Export Result model
const Result = mongoose.model('Result', resultSchema);