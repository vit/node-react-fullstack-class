
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
  }, (token, tokenSecret, profile, done) => {
        User.findOne({googleId: profile.id})
            .then(existingUser => {
                if (existingUser) {
                    //console.log('!!! existing user !!!');
                    done(null, existingUser);
                } else {
                    new User({googleId: profile.id})
                        .save()
                        .then(user => done(null, user))
                }
            })
//      console.log(`access token: ${token}`);
//      console.log(`refresh token: ${tokenSecret}`);
//      console.log('profile: ', profile);
//      console.log(profile);
    //  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //    return done(err, user);
    //  });
  }
));

/*
module.exports = app => {
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google'));
};
*/