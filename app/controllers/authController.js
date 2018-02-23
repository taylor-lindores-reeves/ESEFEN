const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const mail = require('../handlers/mail');
const promisify = require('es6-promisify');
const crypto = require('crypto');

exports.loginForm = (req, res) => {
    if (req.user) return res.redirect('/')
    res.render('forms', {id: 'loginForm'})
};

exports.login = passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Failed to log in!',
    successRedirect: '/',
    successFlash: 'You\'ve successfully logged in'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You\'ve successfully logged out!');
    res.redirect('/')
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }

    req.flash('error', 'Oops! You need to log in to do that!');
    res.redirect('/login');
};

// exports.forgotURL = (req, res) => {
//     if (req.user) {
//         return res.redirect('/dashboard/account')
//     }
//     res.render('forms', {id: 'forgotForm'})
// };

// exports.forgot = async (req, res) => {
//     const user = await User.findOne({ email: req.body.email });

//     if(!user) {
//         req.flash('info', 'No account with that email exists.');
//         res.redirect('/login');
//     }

//     user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//     user.resetPasswordExpires = Date.now() + 3600000;
//     await user.save();

//     const resetURL = `http://${req.headers.host}/account/forgot/${user.resetPasswordToken}`;
//     await mail.send({
//         user,
//         subject: 'Password Reset',
//         resetURL,
//         filename: 'password-reset'
//     });
//     req.flash('info', `Your password reset link has been sent to ${user.email}`);
//     res.redirect('/login');
// };

// exports.resetPage = (req, res) => {
//     res.render('forms', {id: 'resetForm'})
// };

// exports.reset = async (req, res) => {
//     const user = await User.findOne({
//         resetPasswordToken: req.params.token,
//         resetPasswordExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//         req.flash('error', 'Password reset token is invalid or has expired');
//         return res.redirect('/login')
//     }
//     res.render('forms', {id: 'resetForm'});
// };

// exports.confirmedPasswords = (req, res, next) => {
//     if (req.body.password === req.body['password-confirm']) {
//         return next();
//     }

//     req.flash('error', 'Passwords do not match!');
//     res.redirect('back')
// };

// exports.update = async (req, res) => {
//     const user = await User.findOne({
//         resetPasswordToken: req.params.token,
//         resetPasswordExpires: { $gt: Date.now() }
//     });
//     if (!user) {
//         req.flash('error', 'Password reset token is invalid or has expired');
//         return res.redirect('/login')
//     }

//     const setPassword = promisify(user.setPassword, user);
//     await setPassword(req.body.password);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     const updatedUser = await user.save();
//     await req.login(updatedUser);
//     req.flash('success', 'Your password has been reset! You are now logged in.');
//     res.redirect('/list')
// };

