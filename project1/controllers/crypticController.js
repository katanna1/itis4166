const model = require('../models/cryptic');
const fileUpload = require('../public/middleware/fileUpload');


// SHOW all products
exports.index = (req, res, next) => {
    model.find().populate('seller', 'firstName lastName').sort({ price: 1 })
    .then(products => {
        res.render('./cryptic/index', { products });
    })
    .catch(err => next(err));
};


// CREATE a new product
exports.new = (req, res) => {
    res.render('./cryptic/new');
};


// CREATE a new product with file upload
exports.create = (req, res, next) => {
    fileUpload.upload(req, res, function (err) {
        if (err) {
            return res.status(400).send("Error uploading file: " + err.message);
        }
        const productData = {
            title: req.body.title,
            condition: req.body.condition,
            seller: req.session.user,  
            price: parseFloat(req.body.price),
            description: req.body.description,
            imageUrl: req.file ? `/media/items/${req.file.filename}` : null
        };

        const product = new model(productData);
        product.save()
        .then(() => res.redirect('/products'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
    });
};


// SHOW a single product
exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(product => {
        if (product) {
            res.render('./cryptic/show', {product});
        } else {
            let err = new Error("Cannot find product with ID " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};


// EDIT Product
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(product => {
        if (product) {
            res.render('./cryptic/edit', {product});
        } else {
            let err = new Error("Cannot find product with ID " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

// UPDATE product
exports.update = (req, res, next) => {
    let id = req.params.id;
    let product = req.body;
    model.findByIdAndUpdate(id, product, {useFindAndModify: false, runValidators: true})
        .then(product => {
            // if (!product) {
            //     let err = new Error("Cannot find product with ID " + id);
            //     err.status = 404;
            //     return next(err);
            // }

            fileUpload.upload(req, res, function (err) {
                if (err) {
                    return res.status(400).send("Error uploading file: " + err.message);
                }

                product.title = req.body.title;
                product.condition = req.body.condition;
                product.price = parseFloat(req.body.price);
                product.description = req.body.description;

                if (req.file) {
                    product.imageUrl = `/media/items/${req.file.filename}`;
                }

                // Save the updated product
                product.save()
                    .then(() => res.redirect('/products/' + id))
                    .catch(err => {
                        if (err.name === 'ValidationError') {
                            err.status = 400;
                        }
                        next(err);
                    });
            });
        })
        .catch(err => next(err));
};


// DELETE a product
exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(product => {
        if (product) {
            res.redirect('/products');
        } 
    })
    .catch(err => next(err));
};


// SEARCH for products
exports.search = (req, res) => {
    const query = req.query.query ? req.query.query.toLowerCase() : '';
    model.find().populate('seller').sort({ price: 1 })  
    .then(products => {
        const filteredProducts = query 
            ? products.filter(product => 
                product.title.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query)
              )
            : products; 
        res.render('./cryptic/index', { products: filteredProducts });
    })
    .catch(err => res.status(500).send(err.message));
};
