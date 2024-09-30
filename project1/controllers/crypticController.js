const model = require('../models/cryptic');

//GET /products: send all products to the user
exports.index = (req, res)=>{
    //res.send('send all products');
    let products = model.find();
    res.render('./cryptic/index', {products});
};


//GET /products/new: send html form for creating a new product
exports.new = (req, res)=>{
    res.render('./cryptic/new');
};


exports.create = (req,res)=>{
    //res.send('Created a new product');
    let product = req.body;
    model.save(product);
    res.redirect('/products');
};


exports.show = (req, res, next)=>{
    let id = req.params.id;
    let product = model.findById(id);
    if(product) {
        res.render('./cryptic/show', {product});
    } else {
        let err = new Error("Cannot find a product with id "+id);
        err.status = 404;
        next(err);
    }
};

exports.edit = (req, res, next)=>{
    let id = req.params.id;
    let product = model.findById(id);
    if(product) {
        res.render('./cryptic/edit', {product});
    } else {
        let err = new Error("Cannot find a product with id "+id);
        err.status = 404;
        next(err);
    }
};

exports.update = (req, res, next)=>{
    let product = req.body;
    let id = req.params.id;

    if (model.updateById(id, product)) {
        res.redirect('/products/'+id);
    } else {
        let err = new Error("Cannot find a product with id "+id);
        err.status = 404;
        next(err);
    }
};

exports.delete = (req, res, next)=>{
    let id = req.params.id;
    if(model.deleteById(id)) {
        res.redirect('/products');
    } else {
        let err = new Error("Cannot find a product with id "+id);
        err.status = 404;
        next(err);
    }
};
