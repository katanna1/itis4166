const Product = require('../../models/cryptic');

// Checks if user is a guest, if not, redirect to profile page
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are already logged in.');
        return res.redirect('/users/profile');
    }
};

// Checks if user is authenticated, if not, redirect to login page
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'You must be logged in to view this page.');
        return res.redirect('/users/login');
    }
};

// Checks if user is the author of the story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;
    Product.findById(id)
    .then(product =>{
        if(product) {
            if(product.seller == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access this resource.');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a product with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => next(err));
}