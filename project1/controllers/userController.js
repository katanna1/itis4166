const model = require('../models/user');
const Product = require('../models/cryptic');

exports.new = (req, res)=>{
    return res.render('./user/new');
};



exports.create = (req, res, next)=>{
        let user = new model(req.body);
        user.save()
        .then(user=> res.redirect('/users/login'))
        .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('/users/new');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has already been used. Please try again!');  
            return res.redirect('/users/new');
        }
        next(err);
    }); 
};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=>{
        let email = req.body.email;
        let password = req.body.password;
        model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('Incorrect email address. Please try again!');
                req.flash('error', 'Incorrect email address. Please try again!');  
                res.redirect('/users/login');
                } else {
                user.comparePassword(password)
                .then(result=>{
                    if(result) {
                        req.session.user = user._id;
                        req.flash('success', 'You have successfully logged in!');
                        res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Incorrect password. Please try again!');      
                    res.redirect('/users/login');
                }
                });     
            }     
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([
        model.findById(id),
        Product.find({ seller: id }).populate('seller', 'firstName lastName')
    ])
    .then(results => {
        const [user, products] = results;
        res.render('./user/profile', { user, products });
    })
    .catch(err => next(err));
};

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



