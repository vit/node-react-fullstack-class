
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require("mongoose");
const keys = require("../config/keys");

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user));
});


passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: "http://lib.comsep.ru:9090/auth/google/callback"
  }, async (token, tokenSecret, profile, done) => {
        // User.findOne({googleId: profile.id})
        //     .then(existingUser => {
        //         if (existingUser) {
        //             //console.log('!!! existing user !!!');
        //             done(null, existingUser);
        //         } else {
        //             new User({googleId: profile.id})
        //                 .save()
        //                 .then(user => done(null, user))
        //         }
        //     })

        const existingUser = await User.findOne({googleId: profile.id});
        if (existingUser) {
            return done(null, existingUser);
        }
        const user = await new User({googleId: profile.id}).save();
        done(null, user);
  }
));

/*
module.exports = app => {
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'));
};
*/