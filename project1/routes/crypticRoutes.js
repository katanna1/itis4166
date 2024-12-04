const express = require('express');
const controller = require('../controllers/crypticController');
const {isLoggedIn, isAuthor} = require('../public/middleware/auth');
const {validateId, validateProduct, validateResult} = require('../public/middleware/validator');
const router = express.Router();


router.get('/', controller.index);
router.get('/new', isLoggedIn, controller.new);
router.get('/search', controller.search);
router.post('/', isLoggedIn, validateProduct, validateResult, controller.create);
router.get('/:id', validateId, controller.show);
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, controller.edit);
router.put('/:id', validateId, isLoggedIn, isAuthor, validateProduct, validateResult, controller.update);
router.delete('/:id', validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;