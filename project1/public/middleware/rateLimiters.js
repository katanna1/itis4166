const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60*1000, // 1 minute
    max: 5,
    handler: (req, res, next) => {
        let err = new Error('You have exceeded the maximum number of login attempts. Please try again in 15 minutes.');
        err.status = 429;
        return next(err);
    }
});

