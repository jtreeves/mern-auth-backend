// Import Mongoose
const mongoose = require('mongoose')

// Create variable for Schema shortcut
const Schema = mongoose.Schema

// Create User Schema
const UserSchma = new Schema({
    name: {
        type: String,
        required: true
    }
})