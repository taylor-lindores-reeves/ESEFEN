const express = require('express');
const mongoose = require('mongoose');
const { catchErrors } = require('../../handlers/errorHandlers');
const adminController = require('./controllers/dashboard');
const router = express.Router();

router.get('/', 
    adminController.isAdmin,
    adminController.dashboard
);

router.get('/users', 
    adminController.isAdmin,
    catchErrors(adminController.users)
);

router.post('/verify', catchErrors(adminController.verify));
router.post('/delete', catchErrors(adminController.delete));

module.exports = router;