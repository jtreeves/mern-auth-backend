// Imports
require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Models
const User = require('../models/User')

// GET route for users/test
router.get('/test', (req, res) => {
    res.json({msg: 'User endpoint OK!'})
})

module.exports = router