const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const debug = require('debug')('backend:models:user');

// Define the number of salt rounds for bcrypt
const SALT_WORK_FACTOR = 10;

//Define user schema
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,                     // Delete spaces before and after the value before saving in the database
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,               // Convert the value to lowercase before saving in the database
        trim: true,                    // Delete spaces before and after the value before saving in the database
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin'], 
        default: 'student' 
    },

    //Secundary optional data
    fullname: { 
        type: String, 
        trim: true 
    },
    // bio: { 
    //     type: String, 
    //     trim: true 
    // },
    // profilePicture: { 
    //     type: , // Base64 to the profile picture
    //     trim: true 
    // },


    //States and configuration
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastLogin: { 
        type: Date 
    },
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false // Disable the __v version key
}); 

//Pre-save hook to hash the password before saving
userSchema.pre('save', function(next) {
    const user = this;

    //Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    //Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR)
    .then(salt => {
    //Hash the password using the generated salt
        return bcrypt.hash(user.password, salt)
    }).then(hash =>{
        //Override the plain text password with the hashed one
        user.password = hash;
        debug('Password encrypted.');
        next();
    }).catch(err => next(err));
});

//Method to compare a given password with the database hash
userSchema.methods.comparePassword = async function(candidatePassword) {
    debug('Comparing password...')
    return bcrypt.compare(candidatePassword, this.password);
};

//Export the model
module.exports = mongoose.model('User', userSchema);