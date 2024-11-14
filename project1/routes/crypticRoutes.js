const express = require('express');
const controller = require('../controllers/crypticController');
const {isLoggedIn, isAuthor} = require('../public/middleware/auth');
const {validateId} = require('../public/middleware/validator');
const router = express.Router();

//GET /stories: send all products to the user
router.get('/', controller.index);

//GET /stories/new: send html form for creating a new product
router.get('/new', isLoggedIn, controller.new);

// GET /products/search: search for products based on the query
router.get('/search', controller.search);

//POST /stories: create a new product
router.post('/', isLoggedIn, controller.create);

//GET /stories/:id: send details of product identified by id
router.get('/:id', validateId, controller.show);

//GET /stories/:id/edit: send html form for editing an exising product
router.get('/:id/edit', isLoggedIn, isAuthor, validateId, controller.edit);

//PUT /stories/:id: update the product identified by id
router.put('/:id', isLoggedIn, isAuthor, validateId, controller.update);

//DELETE /stories/:id, delete the product identified by id
router.delete('/:id', isLoggedIn, isAuthor, validateId, controller.delete);

module.exports = router;
