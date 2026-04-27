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
        letter: {
            type: String, 
            required: true
        }, // Letter representing the option in the list
    }], // Array of options for multiple-choice and true-false questions 

    //States and configuration
    points: { 
        type: Number, 
        default: 10,
        min: -1
    },
    timeLimit: { 
        type: Number, // Time limit in seconds
        default: -1, // Without time limit
        min: -1
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Question' // Specify the collection name
});

// Indexes
questionSchema.index({ text: 1 });
questionSchema.index({ text: 'text' });

//Order options before saving
questionSchema.pre('save', function(next) {
    const question = this;
    debug('Pre-save hook triggered for question: ', question._id);

    if(question.options && question.options.length > 0){
        //Assign letter if missing
        question.options.forEach((option, index) => {
            if(option.letter === undefined || option.letter === null){
                option.letter = String.fromCharCode(65 + index); // A, B, C, ...
            }
        });

        //Sort options by letter
        question.options.sort((a, b) => a.letter.localeCompare(b.letter));
        debug('Options ordered before saving.');
    }

    next();
});

//Export the model
module.exports = mongoose.model('Question', questionSchema);