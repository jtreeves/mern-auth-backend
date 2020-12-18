// Imports
require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const JWT_SECRET = process.env.JWT_SECRET

// Models
const db = require('../models')

// GET route for users/test (Public)
router.get('/test', (req, res) => {
    res.json({msg: 'User endpoint OK!'})
})

// POST route for users/register (Public)
router.post('/register', (req, res) => {
    // Troubleshooting
    console.log('INSIDE REGISTER')
    console.log(req)
    // Find user by email
    db.User
        .findOne({email: req.body.email})
        .then(user => {
            // If email already exists, send 400 response
            if (user) {
                return res.status(400).json({msg: 'Email already exists'})
            } else {
                // Create a new user
                const newUser = new db.User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                // Salt and hash password, then save new user
                bcrypt.genSalt(10, (error, salt) => {
                    if (error) throw Error
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw Error
                        // Change password to the hash version
                        newUser.password = hash
                        newUser
                            .save()
                            .then(createdUser => {
                                return res.json(createdUser)
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    })
                })
            }
        })
})

// POST route for users/login (Public)
router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password
    // Find a user via email
    db.User
        .findOne({email})
        .then(user => {
            console.log(`USER: ${user}`)
            // If there is not a user
            if (!user) {
                res.status(400).json({msg: 'User not found'})
            } else {
                // If there is a user in the database
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        console.log(`ISMATCH: ${isMatch}`)
                        // Check password for match
                        if (isMatch) {
                            // If user match, send a JSON Web Token
                            // Create a token payload
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
                            return res.status(400).json({msg: 'Email or password is incorrect'})
                        }
                    })
            }
        })
})



module.exports = router