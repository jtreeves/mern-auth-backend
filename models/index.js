// Imports
require('dotenv').config()
const mongoose = require('mongoose')

// Set up MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
})

// Set database with mongoose connection object
const db = mongoose.connection

// Set up an event listener that will fire once the connection opens for the database
db.once('open', () => {
    // Log to the terminal what host and port we are on
    console.log(`Connected to MongoDB at ${db.host} on ${db.port}`)
})

db.on('error', () => {
    console.log(`Database error\n ${error}`)
})

module.exports.User = require('./User')