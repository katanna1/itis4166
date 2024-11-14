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
    req.flash('success', 'Upload Successful!');    
};


// CREATE a new product with file upload
exports.create = (req, res, next) => {
    fileUpload.upload(req, res, function (err) {
        if (err) {
            req.flash('error', 'File upload error! Please try again!');
            return res.redirect('/products/new'); // Redirect after flash
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
        .then(() => {
            req.flash('success', 'Upload Successful!');
            res.redirect('/products');
        })
        .catch(err => {
            req.flash('error', 'Submission did not go through. Please try again!');
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


// EDIT Product - Render the edit form only
exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(product => {
        if (product) {
            res.render('./cryptic/edit', {product}); // No flash message here
        } else {
            let err = new Error("Cannot find product with ID " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

// UPDATE Product - Update the product in the database
exports.update = (req, res, next) => {
    let id = req.params.id;
    fileUpload.upload(req, res, function (err) {
        if (err) {
            req.flash('error', 'File upload error! Please try again.');
            return res.redirect(`/products/${id}/edit`);
        }
        model.findByIdAndUpdate(id, {
            title: req.body.title,
            condition: req.body.condition,
            price: parseFloat(req.body.price),
            description: req.body.description,
            imageUrl: req.file ? `/media/items/${req.file.filename}` : undefined
        }, { useFindAndModify: false, runValidators: true, new: true })
        .then(updatedProduct => {
            if (updatedProduct) {
                req.flash('success', 'Product updated successfully!');
                res.redirect(`/products/${id}`);
            } else {
                let err = new Error("Cannot find product with ID " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            req.flash('error', 'Update failed! Please try again.');
            res.redirect(`/products/${id}/edit`);
        });
    });
};

// DELETE a product
exports.delete = (req, res, next) => {
    let id = req.params.id;
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(product => {
        if (product) {
            req.flash('success', 'Delete Successful!');    
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
