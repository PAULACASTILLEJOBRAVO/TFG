const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('backend:models:role');

//Define user schema
const roleSchema = new Schema({
    value: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true, 
        lowercase: true 
    },
    label: {
        type: String,
        required: true,
        trim: true,
    }
}, 
{ 
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Disable the __v version key
    collection: 'Role' // Specify the collection name
}); 


//Export the model
module.exports = mongoose.model('Role', roleSchema);