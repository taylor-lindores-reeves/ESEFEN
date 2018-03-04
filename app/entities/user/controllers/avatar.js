const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.dashboard = (req, res) => { 
    res.render('userdash') 
};

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto) {
            next (null, true)
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

exports.uploadPhoto = multer(multerOptions).single('photo');

exports.resizePhoto = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }

    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(48, jimp.AUTO);
    await photo.write(`./app/temp/images/uploads/${req.body.photo}`);   
    next();
};

exports.updatePhoto = async (req, res) => {
    if (!req.body.photo) {
        req.flash('error', 'You have not added a photo!');
        res.redirect('back');
    } else {
        const updates = {
            photo: req.body.photo
        };

        await User.findByIdAndUpdate(
            { _id: req.user._id },
            { $set: updates },
            { new: true, runValidators: true, context: 'query' }
        );
        
        req.flash('info', 'You successfully updated your profile picture!');
        res.redirect('/');
    }
};