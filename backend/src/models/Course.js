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
        default: false 
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