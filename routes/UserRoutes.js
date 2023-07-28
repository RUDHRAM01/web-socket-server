const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const { auth } = require('../db/Auth');

// Import the express-rate-limit package
const rateLimit = require('express-rate-limit');

// Set the maximum number of requests allowed within a specific time window (e.g., 10 requests in 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many login attempts from this IP, please try again later.',
    });
  },
});

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many logout attempts from this IP, please try again later.',
    });
  },
});

userRouter.post('/register', userController.register);

// Apply the rate limit middleware to the login route
userRouter.post('/login', loginLimiter, userController.login);

// Apply the rate limit middleware to the logout route
// userRouter.post('/logout', logoutLimiter, userController.logout);

module.exports = userRouter;
