const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { memoryStorage } = require('multer');


const storage = memoryStorage();
const upload = multer({ storage: storage });

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      msg: 'Too many requests from this IP, please try again later.',
    });
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Limit each IP to 5 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      msg: 'Too many requests from this IP, please try again later.',
    });
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // Limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      msg: 'you can only upload 2 images at a time. Please try again later. 🙂',
    });
  },
});



userRouter.post('/login-as-guest',loginLimiter, userController.loginAsGuest);

userRouter.post('/register',loginLimiter, userController.register);

userRouter.post('/login', loginLimiter, userController.login);

userRouter.post('/logout', protect,loginLimiter, userController.logout);

userRouter.get('/search', protect, userController.searchUser);

userRouter.get('/allusers', protect, userController.allUsers);
// userRouter.post('/logout', logoutLimiter, userController.logout);

userRouter.post('/uploadImg', protect, uploadLimiter, upload.single('img'), userController.uploadImg);

userRouter.post('/updateName', protect, userController.updateName);

userRouter.post('/updatePassword', loginLimiter, userController.updatePassword);

userRouter.post('/setPassword',loginLimiter, userController.setPassword);

userRouter.post('/greetingMessage', loginLimiter,userController.greetingMessage);

module.exports = userRouter;
