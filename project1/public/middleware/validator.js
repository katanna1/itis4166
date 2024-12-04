const {body} = require('express-validator');
const {validationResult} = require('express-validator');


exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstName', 'First name cannot be empty.').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty.').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(), 
    body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max:64})
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address.').isEmail().trim().escape().normalizeEmail(), 
    body('password', 'Password must be at least 8 characters and at most 64 characters.').isLength({min: 8, max:64})
];

exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateProduct = [
    // body('title')
    //     .notEmpty().withMessage('Title cannot be empty.')
    //     .trim()
    //     .escape(),
    // body('description')
    //     .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long.')
    //     .trim()
    //     .escape(),
    // body('condition')
    //     .notEmpty().withMessage('Condition is required.')
    //     .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor']).withMessage('Condition must be a valid option.'),
    // body('price')
    //     .isFloat({ min: 0.01 }).withMessage('Price must be at least $0.01.')
    //     .toFloat(),
    // (req, res, next) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         // Collect error messages
    //         const errorMessages = errors.array().map(err => err.msg);

    //         // Flash error messages and re-render the form with user input
    //         req.flash('error', errorMessages);
    //         return res.render('pages/new', {
    //             errorMessages,
    //             formData: req.body // Pass the form data back to the form
    //         });
    //     }
    //     next();
    // }
];