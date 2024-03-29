var passport = require('passport');
var User = require('../models/user');
require('dotenv').config()
var GitHubStrategy = require('passport-github').Strategy
var GoogleStrategy = require('passport-google-oauth2').Strategy
passport.use(new GitHubStrategy({

    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    //console.log(profile);
    var profileData = {
        name: profile.displayName,
        //username:profile.username,
        email: profile._json.email,
        photo: profile._json.avatar_url
    }
    User.findOne({ email: profile._json.email }, (err, user) => {
        //console.log('in git hub user',err,user);
        //req.session.userId = user.id;
        if (err) return done(err);
        if (!user) {

            User.create(profileData, (err, addedUser) => {
                console.log('in error', err, addedUser);
                if (err) return done(err, false);
                // console.log('inside create');
                // console.log('added user in git hub',addedUser);
                return done(null, addedUser);
            })
        } else {
            done(null, user);
        }

    })



}))

passport.use(new GoogleStrategy({

    clientID: process.env.google_CLIENT_ID,
    clientSecret: process.env.google_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    //console.log(profile);
    var profileData = {
        name: profile.displayName,
        //username:profile.username,
        email: profile._json.email,
        photo: profile._json.picture
    }
    User.findOne({ email: profile._json.email }, (err, user) => {
        // req.session.userId = user.id;
        // console.log('in google user',err,user);
        if (err) return done(err);
        if (!user) {

            User.create(profileData, (err, addedUser) => {
                // console.log('in error',err);
                if (err) return done(err, false);
                // console.log('inside create');
                //console.log('added user',err,addedUser);
                return done(null, addedUser);
            })
        } else {
            done(null, user);
        }

    })



}))

passport.serializeUser((user, done) => {
    console.log(user, 'inside serialize user');
    done(null, user.id);

})

passport.deserializeUser((id, done) => {
    User.findById(id, 'name email', (err, user) => {
        done(err, user)
    })

})