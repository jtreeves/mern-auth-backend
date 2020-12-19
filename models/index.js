// Import external dependencies
require('dotenv').config()
const mongoose = require('mongoose')

// Establish MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})

// Set database with mongoose connection object
const db = mongoose.connection

// Create event listener to fire when the connection opens
db.once('open', () => {
    // Log to the terminal the host and port of the database
    console.log(`Connecting to MongoDB at ${db.host} on ${db.port}`)
})

// Create event listener to fire if an error occurs
db.on('error', () => {
    // Log to the terminal any database errors
    console.log(`DATABASE ERROR: ${error}`)
})

// Require and export User
module.exports.User = require('./User')