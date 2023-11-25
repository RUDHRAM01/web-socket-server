const asyncHandler = require('express-async-handler')
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');
const Message = require('../models/MessageModel');
// const crypto = require('crypto');


// const encryptionKey = process.env.ENCRYPTION_KEY;

// function encrypt(text) {
//     const iv = crypto.randomBytes(16);
//     const key = crypto.createHash('sha256').update(encryptionKey).digest('base64').substr(0, 32);

//     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//     let encrypted = cipher.update(text, 'utf-8', 'hex');
//     encrypted += cipher.final('hex');
//     return { encrypted, iv: iv.toString('hex') };
// }
  
const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId ,iv } = req.body;
    
    const userId = req.user._id
    const chat = await Chat.findById(chatId).populate('users');
    if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
    }
    if (!message) {
        return res.status(400).json({ msg: 'Message is required' });
    }
    let newMessage = await Message.create({
        sender: userId,
        chat: chatId,
        content: message,
        iv: iv
    });
    chat.latestMessage = newMessage._id;
    await chat.save();
    newMessage = {
        ...newMessage._doc,
        users : chat.users
    }
    res.status(201).json({ msg: 'Message sent successfully', newMessage });
});


const allMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
    }
    const messages = await Message.find({ chat: chatId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 }); 
res.status(200).json({ messages });
});






module.exports = { sendMessage, allMessages };