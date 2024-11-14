// Middleware for validating id of the products
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid product id.');
        err.status = 400;
        return next(err);
    }
    next();
}
