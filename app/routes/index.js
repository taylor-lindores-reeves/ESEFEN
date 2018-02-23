const express = require('express');
const { catchErrors } = require('../handlers/errorHandlers');
const mongoose = require('mongoose');
const registrationController = require('../controllers/registrationController');
const authController = require('../controllers/authController');
const verificationController = require('../controllers/verificationController');
const adminController = require('../controllers/adminController');
const router = express.Router();

router.get('/', (req, res) => { res.render('index') });

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
    authController.login
);

router.get('/logout', authController.logout)


// custom 404 page
router.use((req, res) => {
    res.status(404);
    res.render('404');
});

// custom 500 page
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


module.exports = router;