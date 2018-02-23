const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');
const Verification = mongoose.model('Verification');
const mail = require('../handlers/mail');

exports.verification = (req, res) => {
    res.render('verification-sent');
};

exports.isVerified = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        req.flash('error', 'An email address for this account does not exist!');
        res.redirect('/register')
    }
    if (!user.isVerified && user.isAdmin) {
        req.flash('error', 'You need to verify your email address first! <a href="/resend">Click here to resend a verification link.</a>');
        res.redirect('/login')
    } else if (!user.isVerified) {
        req.flash('error', 'You need to verify your email address first!');
        res.redirect('/login')
    } else {
        return next();
    }
};

exports.confirmationPost = async (req, res) => {
    const token = await Verification.findOne({ token: req.params.token });
    if (!token) {
        req.flash( 'info', 'Your token has expired, please resend the verification email.' );
        res.redirect('/login');
    } else {
        const user = await User.findOne({ _id: token.user });
        if (user.isVerified) {
            req.flash( 'info', 'This account has already been verified, please log in.' );
        } else {
            user.isVerified = true;
            await user.save(() => {
                req.flash('success', "Your account has been verified. Please use the form below to log in.");
            });

            await mail.send({
                user,
                subject: 'Thanks for registering!',
                filename: 'thank-you'
            });
        }

        res.redirect('/login');
    }
};
