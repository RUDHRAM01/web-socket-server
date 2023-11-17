const messageRoute = require("express").Router();   
const { protect } = require('../middleware/authMiddleware');
const messageController = require('../controllers/messageController');

messageRoute.post("/", protect, messageController.sendMessage);
// messageRoute.get("/:chatId", protect, allMessages);

module.exports = messageRoute