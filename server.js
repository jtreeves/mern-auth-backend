// Import external dependencies
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
require('./config/passport')(passport)

// Import internal controller
const users = require('./controllers/users')

// Use controller
app.use('/controllers/users', users)

// Use middleware
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Get home route
app.get('/', (req, res) => {
    res.status(200).json({message: 'Viewing the backend of a MERN app'})
})

// Create port
const PORT = process.env.PORT || 8000

// Listen
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
})