const express = require('express');
const mongoose = require('mongoose');
const { catchErrors } = require('../handlers/errorHandlers');
const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');
const registrationController = require('../controllers/registrationController');
const home = require('./controllers/home');
const router = express.Router();

router.get('/', home);

// ------------ REGISTRATION CONTROLLER ------------- //

router.get( '/register', registrationController.registerForm);
router.post( '/register',
    catchErrors(registrationController.validateRegister),
    catchErrors(registrationController.register)
);

// ------------ VERIFICATION CONTROLLER ------------- //
// router.get('/resend', userController.resendURL);
// router.post('/resend', catchErrors(userController.resendVerificationToken));
router.get('/verification', verificationController.verification);
router.get('/account/verify/:token', catchErrors(verificationController.confirmationPost));
router.post('/account/verify/:token', catchErrors(verificationController.confirmationPost));

// ------------ LOGIN CONTROLLER ------------- //

router.get('/login', authController.loginForm); 
router.post( '/login',
    catchErrors(verificationController.isVerified),
    catchErrors(authController.logInStatus),
    authController.login
);

router.get('/logout', authController.logout);

module.exports = router;