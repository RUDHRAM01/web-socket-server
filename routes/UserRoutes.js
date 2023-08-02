const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

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

userRouter.post('/login', loginLimiter, userController.login);

userRouter.get('/allusers',protect, userController.allUser);
// userRouter.post('/logout', logoutLimiter, userController.logout);

module.exports = userRouter;
