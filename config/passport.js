require('dotenv').config()

// Passport strategy for authenticating endpoints with a JSON web token
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const options = {}
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// JWT_SECRET is inside of our environment
options.secretOrKey = process.env.JWT_SECRET

// Export function when it's created
module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        // User found by id of payload
        // After find user, check to see if user is in database
    }))
}