const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../public/middleware/auth');
const {logInLimiter} = require('../public/middleware/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../public/middleware/validator');


const router = express.Router();


router.get('/new', isGuest, controller.new);
router.post('/', isGuest, validateSignUp, validateResult, controller.create);
router.get('/login', isGuest, controller.getUserLogin);
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.login);
router.get('/profile', isLoggedIn, controller.profile);
router.get('/logout', isLoggedIn, controller.logout);


module.exports = router;