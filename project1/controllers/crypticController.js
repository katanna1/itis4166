const model = require('../models/cryptic');
const fileUpload = require('../public/middleware/fileUpload'); 


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
    fileUpload.upload(req, res, function (err) {
        if (err) {
            return res.status(400).send("Error uploading file: " + err.message);
        }
        let product = {
            title: req.body.title,
            condition: req.body.condition,
            seller: req.body.seller,  
            price: parseFloat(req.body.price),
            description: req.body.description,
            imageUrl: `/media/items/${req.file.filename}` 
        };
        model.save(product);
        res.redirect('/products');
    });
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
    let id = req.params.id;
    let product = model.findById(id);

    if (product) {
        fileUpload.upload(req, res, function (err) {
            if (err) {
                return res.status(400).send("Error uploading file: " + err.message);
            }
            product.title = req.body.title;
            product.condition = req.body.condition;
            product.seller = req.body.seller;
            product.price = parseFloat(req.body.price);
            product.description = req.body.description;

            if (req.file) {
                product.imageUrl = `/media/items/${req.file.filename}`;
            }
            if (model.updateById(id, product)) {
                res.redirect('/products/' + id);
            } else {
                let err = new Error("Cannot update a product with id " + id);
                err.status = 404;
                next(err);
            }
        });
    } else {
        let err = new Error("Cannot find a product with id " + id);
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
