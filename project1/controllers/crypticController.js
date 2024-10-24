const model = require('../models/cryptic');
const fileUpload = require('../public/middleware/fileUpload');

// SHOW all products
exports.index = (req, res, next) => {
    model.find()
    .then(products => {
        // Sort products by price in ascending order
        products.sort((a, b) => a.price - b.price); 
        res.render('./cryptic/index', {products});
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

        let productData = {
            title: req.body.title,
            condition: req.body.condition,
            seller: req.body.seller,
            price: parseFloat(req.body.price),
            description: req.body.description,
            imageUrl: req.file ? `/media/items/${req.file.filename}` : null
        };

        let product = new model(productData); 
        product.save() //Inserts data to databsse
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
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid product ID: " + id);
        err.status = 400;
        return next(err);
    }
    model.findById(id)
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
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid product ID: " + id);
        err.status = 400;
        return next(err);
    }
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

    // Validate the product ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid product ID: " + id);
        err.status = 400;
        return next(err);
    }

    model.findById(id)
        .then(product => {
            if (!product) {
                let err = new Error("Cannot find product with ID " + id);
                err.status = 404;
                return next(err);
            }

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
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error("Invalid product ID: " + id);
        err.status = 400;
        return next(err);
    }
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(product => {
        if (product) {
            res.redirect('/products');
        } else {
            let err = new Error("Cannot find product with ID " + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
};

exports.search = (req, res) => {
    const query = req.query.query.toLowerCase();
    model.find()
    .then(products => {
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
        res.render('./cryptic/index', {products: filteredProducts});
    })
    .catch(err => res.status(500).send(err.message));
};




// const model = require('../models/cryptic');
// const fileUpload = require('../public/middleware/fileUpload'); 


// //GET /products: send all products to the user
// exports.index = (req, res)=>{
//     let products = model.find();
//     //Sort by price in ascending order
//     products.sort((a, b) => a.price - b.price); 
//     res.render('./cryptic/index', {products});
// };

// //GET /products/new: send html form for creating a new product
// exports.new = (req, res)=>{
//     res.render('./cryptic/new');
// };

// // Creating new product
// exports.create = (req,res)=>{
//     fileUpload.upload(req, res, function (err) {
//         if (err) {
//             return res.status(400).send("Error uploading file: " + err.message);
//         }
//         let product = {
//             title: req.body.title,
//             condition: req.body.condition,
//             seller: req.body.seller,  
//             price: parseFloat(req.body.price),
//             description: req.body.description,
//             imageUrl: `/media/items/${req.file.filename}` 
//         };
//         model.save(product);
//         res.redirect('/products');
//     });
// };

// // Showing a singular product
// exports.show = (req, res, next)=>{
//     let id = req.params.id;
//     let product = model.findById(id);
//     if(product) {
//         res.render('./cryptic/show', {product});
//     } else {
//         let err = new Error("Cannot find a product with id "+id);
//         err.status = 404;
//         next(err);
//     }
// };

// exports.edit = (req, res, next)=>{
//     let id = req.params.id;
//     let product = model.findById(id);
//     if(product) {
//         res.render('./cryptic/edit', {product});
//     } else {
//         let err = new Error("Cannot find a product with id "+id);
//         err.status = 404;
//         next(err);
//     }
// };

// // Updating a product, and then displaying new product with updated information, on products page
// exports.update = (req, res, next)=>{
//     let id = req.params.id;
//     let product = model.findById(id);

//     // Will keep all existing information initially, but update any changes made by user
//     if (product) {
//         fileUpload.upload(req, res, function (err) {
//             if (err) {
//                 return res.status(400).send("Error uploading file: " + err.message);
//             }
//             product.title = req.body.title;
//             product.condition = req.body.condition;
//             product.seller = req.body.seller;
//             product.price = parseFloat(req.body.price);
//             product.description = req.body.description;

//             if (req.file) {
//                 product.imageUrl = `/media/items/${req.file.filename}`;
//             }
//             if (model.updateById(id, product)) {
//                 res.redirect('/products/' + id);
//             } else {
//                 let err = new Error("Cannot update a product with id " + id);
//                 err.status = 404;
//                 next(err);
//             }
//         });
//     } else {
//         let err = new Error("Cannot find a product with id " + id);
//         err.status = 404;
//         next(err);
//     }
// };

// // Deleting a product
// exports.delete = (req, res, next)=>{
//     let id = req.params.id;
//     if(model.deleteById(id)) {
//         res.redirect('/products');
//     } else {
//         let err = new Error("Cannot find a product with id "+id);
//         err.status = 404;
//         next(err);
//     }
// };

// // Search for products based on title or description
// exports.search = (req, res) => {
//     const query = req.query.query.toLowerCase(); // not case-sensitive
//     let products = model.find(); 

//     // Filter products based on the search query
//     const filteredProducts = products.filter(product => {
//         return product.title.toLowerCase().includes(query) || 
//                product.description.toLowerCase().includes(query);
//     });
//     res.render('./cryptic/index', { products: filteredProducts });
// };