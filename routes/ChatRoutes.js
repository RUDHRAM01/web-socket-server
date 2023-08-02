const router = require('express').Router();
const {protect} = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

router.post("/", protect, chatController.accessChat);
router.route('/').get(protect, chatController.fetchChats);
router.route('/group').post(protect, chatController.createGroupChat);
router.route('/rename').put(protect, chatController.renameGroup);
router.route('/groupadd').put(protect, chatController.addToGroup);
router.route('/groupremove').put(protect, chatController.removeFromGroup);

module.exports = router;
