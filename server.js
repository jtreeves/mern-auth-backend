// Imports
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
const PORT = process.env.PORT || 8000

// Middleware
app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Routes
app.get('/', (req, res) => {
    res.status(200).json({message: 'Smile, you are being watched by the backend engineering team!'})
})

// Listen
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})