const mongoose = require('mongoose')
const User = mongoose.model('User');

exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You need to log in first')
        res.redirect('/')
    } else if (!req.user.isAdmin) {
        res.redirect('/')
    } else {
        return next()
    }
}

exports.dashboard = (req, res) => {
    res.render('admindash', {id: 'welcome'})
};

exports.users = async (req, res) => {
    const users = await User.find();
    res.render('admindash', {users, id: 'displayUsers'})
};

exports.verify = async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        var user = await User.findOneAndUpdate(
            {email: req.body.verify, isVerified: false},
            {$set: {isVerified: true}}
        )
    }

    res.redirect('back')
}

exports.delete = async (req, res) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        var user = await User.findOne({email: req.body.delete});
        await User.remove({_id: user._id});
    }

    res.redirect('back')
}