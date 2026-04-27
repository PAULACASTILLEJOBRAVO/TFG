const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:difficulty');

//Define user schema
const difficultySchema = new Schema({
    value: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true, 
        lowercase: true 
    }
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Difficulty' // Specify the collection name
}); 

//Export the model
module.exports = mongoose.model('Difficulty', difficultySchema);