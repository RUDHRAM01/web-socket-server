

const router = require('express').Router();
const userController = require('../controllers/userController');
const rateLimit = require('express-rate-limit');

const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      msg : 'Too many attempts from this IP, please try again later.',
    });
  },
});

router.get("/verify", Limiter, userController.verify);
router.get("/updatePassword", Limiter, userController.verifyPassword);


module.exports = router;

