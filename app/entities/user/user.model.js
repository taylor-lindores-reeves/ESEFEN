const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
    index: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: 'Please supply an email address',
    validate: [validator.isEmail, 'Invalid Email Address'],
    index: true
  },
  isVerified: { // make so only administrator can verify users 
    type: Boolean,
    default: false,
    index: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
    index: true
  },
  isLoggedIn: {
    type: Boolean,
    createdAt: { type: Date, expires: 1800, default: Date.now }
  },
  token: String,
  photo: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema); 