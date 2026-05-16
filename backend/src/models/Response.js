const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    pointsAwarded: { 
        type: Number,
    },
    answeredAt: {
        type: Date,
        default: Date.now
    },

    //Relations
    playerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
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
    }
}, { 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Response' // Specify the collection name
});

//Export the model
module.exports = mongoose.model('Response', responseSchema);