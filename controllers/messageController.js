const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');

const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
    }
    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }
    const newMessage = await Message.create({
        sender: userId,
        chat: chatId,
        content : message
    });
    chat.latestMessage = newMessage._id;
    await chat.save();
    res.status(201).json({ msg: 'Message sent successfully', newMessage });
});






module.exports = { sendMessage };