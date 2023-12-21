const rateLimit = require('express-rate-limit');

const limitTracker = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 10 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            msg: 'Too many requests from this IP, please try again later. 🙂',
        });
    },
});

module.exports = limitTracker;