const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const Verification = mongoose.model('Verification');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const mail = require('../handlers/mail');

exports.registerForm = (req, res) => {

    if (req.user) {
        return res.redirect('/')
    }
    res.render('forms', {id: 'registerForm'})
}

exports.validateRegister = async (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        gmail_remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });

    req.checkBody('password', 'Password has to be a minimum of 6 characters!').notEmpty().isLength({ min: 6 });
    req.checkBody('confirm', 'Passwords do not match').equals(req.body.password);
    
    let errors = req.validationErrors();

    if (errors) {
        res.render('forms', {id: 'registerForm', body: req.body, errors });
        return;
    }
    
    next();
};

exports.register = async (req, res, next) => { 
    const userEmail = await User.findOne({ email: req.body.email });
    if(userEmail) {
        const forgotURL = `http://${req.headers.host}/forgot`;
        req.flash('error', `An account with that email already exists. <a href="${forgotURL}">Forgotten your password?</a>`)
        return res.redirect('/login');
    }
 
    const user = await new User({ name: req.body.name, email: req.body.email });
    const hashable = bcrypt.hashSync(process.env.SALTABLE, 8);
    const admin = await bcrypt.compare(req.body.adminCode, hashable)

    if (admin) {
        user.isAdmin = true;
    } else if (req.body.adminCode === '') {
        
    } else {
        req.flash('error', 'Incorrect administrator access code!');
        return res.redirect('back')
    }

    const register = promisify(User.register, User);
    await register(user, req.body.password);

    if (!user.isVerified && user.isAdmin) {
        const user = await User.findOne({ email: req.body.email });
        const userToken = new Verification({ user: user._id, token: crypto.randomBytes(20).toString('hex') });

        await user.save();
        await userToken.save();

        const verifyURL = `http://${req.headers.host}/account/verify/${userToken.token}`;
        await mail.send({
            user,
            subject: 'Account Verification',
            verifyURL,
            filename: 'account-verification'
        });

        res.redirect('/verification');
    } else {
        req.flash('success', 'You have successfully signed up to ESEFEN, now you just need an administrator to verify your account.');
        res.redirect('/');
    }
};
