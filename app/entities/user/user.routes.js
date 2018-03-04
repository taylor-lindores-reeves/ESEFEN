const express = require('express');
var mongoose = require('mongoose');
const { catchErrors } = require('../../handlers/errorHandlers');
const authController = require('./controllers/auth');
const wallController = require('./controllers/wall');
const boardController = require('./controllers/board');
const avatarController = require('./controllers/avatar');
const router = express.Router();

router.get('/dashboard',
    catchErrors(authController.isAuthenticated),
    avatarController.dashboard
);

router.post('/photo', 
    avatarController.uploadPhoto,
    catchErrors(avatarController.resizePhoto),
    catchErrors(avatarController.updatePhoto)
);

router.get('/board', catchErrors(boardController.board));
router.get('/wall', catchErrors(wallController.wall));


router.get('/:id', 
    catchErrors(authController.isAuthenticated), 
    wallController.addattr
);

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