const asyncHandler = require('express-async-handler');
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    
    if (!userId) {
        console.log('No user id');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    var isChat = await Chat.find({ 
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
     }).populate('users',"-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username profilePic email"
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, req.user._id]
        };
        try {
            const createChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', "-password");
            
            res.status(200).json(fullChat);
        } catch (err) {
            console.log(err);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', "-password")
            .populate("latestMessage")
            .populate("groupAdmin").sort({ updatedAt: -1 });
        const fullChat = await User.populate(chat, {
            path: "latestMessage.sender",
            select: "username profilePic email"
        });

            res.status(200).json(fullChat);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});


module.exports = {
    accessChat,
    fetchChats
};