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
            type: String 
        }
    ], // Correct options for multiple-choice and true-false questions

    //States and configuration
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isReusable: { // Can be used in multiple teachers
        type: Boolean, 
        default: true 
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
    AllowMultipleSelections: { // Only for multiple-choice questions
        type: Boolean, 
        default: false 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Question' // Specify the collection name
});

//Ensure and order options before saving
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