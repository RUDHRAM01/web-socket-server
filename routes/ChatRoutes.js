const router = require('express').Router();
const {protect} = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

router.post("/", protect, chatController.accessChat);
router.route('/').get(protect, chatController.fetchChats);
// router.route('/group').post(secure, chatController.createGroupChat);
// router.route('/rename').put(secure, chatController.renameGroup);
// router.route('/groupremove').put(secure, chatController.removeFromGroup);
// router.route('/groupadd').put(secure, chatController.addToGroup);

module.exports = router;
