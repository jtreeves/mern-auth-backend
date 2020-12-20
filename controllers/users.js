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
router.post('/signup', async (req, res) => {
    try {
        const currentUser = await db.User.findOne({
            email: req.body.email
        })
        if (currentUser) {
            return res.status(400).json({msg: 'Email already exists'})
        } else {
            const newUser = new db.User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (error, salt) => {
                if (error) throw Error
                bcrypt.hash(newUser.password, salt, async (error, hash) => {
                    try {
                        if (error) throw Error
                        newUser.password = hash
                        const createdUser = await newUser.save()
                        res.status(201).json(createdUser)
                    } catch(error) {
                        console.log(`HASHING ERROR: ${error}`)
                    }
                })
            })
        }
    } catch(error) {
        console.log(`SIGNUP ERROR: ${error}`)
    }
})

// Create POST route for controllers/users/login (Public)
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const currentUser = await db.User.findOne({email})
        if (!currentUser) {
            res.status(400).json({msg: 'User not found'})
        } else {
            const isMatch = await bcrypt.compare(password, currentUser.password)
            if (isMatch) {
                const payload = {
                    id: currentUser.id,
                    email: currentUser.email,
                    name: currentUser.name
                }
                jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (error, token) => {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`
                    })
                })
            } else {
                return res.status(400).json({msg: 'Email or password is incorrect'})
            }
        }
    } catch(error) {
        console.log(`LOGIN ERROR: ${error}`)
    }
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