const express = require('express');
const mongoose = require('mongoose');
const { catchErrors } = require('../handlers/errorHandlers');
const adminController = require('../controllers/admin/adminController');
const router = express.Router();

router.get('/', adminController.isAdmin, catchErrors(adminController.users));
router.post('/verify', catchErrors(adminController.verify));
router.post('/delete', catchErrors(adminController.delete));



module.exports = router;