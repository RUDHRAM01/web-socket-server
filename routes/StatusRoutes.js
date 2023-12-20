const StatusController = require('../controllers/StatusController');
const StatusRouter = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const { memoryStorage } = require('multer');
const rateLimit = require('express-rate-limit');

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            msg: 'Too many requests from this IP, please try again later.',
        });
    },
});


const storage = memoryStorage();
const upload = multer({ storage: storage });
StatusRouter.post('/', protect, upload.single('img'), uploadLimiter, StatusController.createStatus);
StatusRouter.get('/', protect, StatusController.getAllStatus);

module.exports = StatusRouter;