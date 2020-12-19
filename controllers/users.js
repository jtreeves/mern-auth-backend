// Import external dependencies
require('dotenv').config()
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Import internal models
const db = require('../models')

// Create router
const router = express.Router()

// Create JSON web token
const JWT_SECRET = process.env.JWT_SECRET

// Create GET route for controllers/users/test (Public)
router.get('/test', (req, res) => {
    res.json({msg: 'Viewing the test page for the backend of a MERN app'})
})

// Create POST route for controllers/users/signup (Public)
router.post('/signup', (req, res) => {
    db.User
        // Find user by email
        .findOne({email: req.body.email})
        .then(user => {
            if (user) {
                // Send 400 response if email already exists
                return res.status(400).json({msg: 'Email already exists'})
            } else {
                // Create new user if email does not already exist
                const newUser = new db.User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                // Create salt for password
                bcrypt.genSalt(10, (error, salt) => {
                    if (error) throw Error
                    // Hash password with salt
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw Error
                        // Change password to the hash version
                        newUser.password = hash
                        // Save new user with hashed password
                        newUser
                            .save()
                            .then(createdUser => {
                                return res.json(createdUser)
                            })
                            .catch(error => {
                                console.log(`NEW USER ERROR: ${error}`)
                            })
                    })
                })
            }
        })
})

// Create POST route for controllers/users/login (Public)
router.post('/login', (req, res) => {
    // Grab email and password from form
    const email = req.body.email
    const password = req.body.password
    db.User
        // Find user by email
        .findOne({email})
        .then(user => {
            if (!user) {
                // Send 400 response if user does not exist
                res.status(400).json({msg: 'User not found'})
            } else {
                // Log in user if user exists
                bcrypt
                    // Check password for match
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            // Create a token payload if match
                            const payload = {
                                id: user.id,
                                email: user.email,
                                name: user.name
                            }
                            // Sign token
                            jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                            })
                        } else {
                            // Send 400 response if no match
                            return res.status(400).json({msg: 'Email or password is incorrect'})
                        }
                    })
            }
        })
})

// Create GET route for controllers/users/current (Private)
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

// Export router
module.exports = router