const express = require('express');
const mongoose = require('mongoose');
const { catchErrors } = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');
const registrationController = require('../controllers/registrationController');
const home = require('./controllers/home');
const router = express.Router();









module.exports = router;