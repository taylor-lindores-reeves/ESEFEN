const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser(), function(user, done) {
    done(null, user);
});

passport.deserializeUser(User.deserializeUser(), function(user, done) {
    done(null, user);
});