const express = require('express');
const controller = require('../controllers/crypticController');


const router = express.Router();

//GET /products: send all products to the user
router.get('/', controller.index);


//GET /products/new: send html form for creating a new product
router.get('/new', controller.new);


//POST /products: create a new product
router.post('/', controller.create);


//GET /products/:id: send details of product identified by id
router.get('/:id', controller.show);

//GET /products/:id/edit: send html form for editing an existing product
router.get('/:id/edit', controller.edit);

//PUT /products/:id: update the product identified by id
router.put('/:id', controller.update);

//DELETE /products/:id: delete the product identified by id
router.delete('/:id', controller.delete);

module.exports = router;
