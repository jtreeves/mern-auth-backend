require('dotenv').config()

// Passport strategy for authenticating endpoints with a JSON web token
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
// const db = require('../models')
const User = require('../models/User')

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// JWT_SECRET is inside of our environment
options.secretOrKey = process.env.JWT_SECRET

// Export function when it's created
module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // User found by id of payload
        // After find user, check to see if user is in database
        User
            .findById(jwt_payload.id)
            .then(user => {
                // jwt_payload is an object literal that contains the decoded JWT payload
                // done is a callback function that has an error as its first argument and other arguments are what are passed up
                if (user) {
                    // If a user is found, return null (for error) and the user
                    return done(null, user)
                } else {
                    // If no user is found, return false
                    return done(null, false)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }))
}