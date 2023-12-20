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
  max: 10, // Limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      msg: 'Too many requests from this IP, please try again later.',
    });
  },
});

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
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
      msg: 'Too many requests from this IP, please try again later.',
    });
  },
});


userRouter.post('/register', userController.register);

userRouter.post('/login', loginLimiter, userController.login);

userRouter.get('/search', protect, userController.searchUser);

userRouter.get('/allusers', protect, userController.allUsers);
// userRouter.post('/logout', logoutLimiter, userController.logout);

userRouter.post('/uploadImg', protect, uploadLimiter, upload.single('img'), userController.uploadImg);

userRouter.post('/updateName', protect, userController.updateName);

userRouter.post('/updatePassword', loginLimiter, userController.updatePassword);

userRouter.post('/setPassword', userController.setPassword);

userRouter.post('/greetingMessage', userController.greetingMessage);

module.exports = userRouter;
