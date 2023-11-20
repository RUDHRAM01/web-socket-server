const asyncHandler = require('express-async-handler');
const Chat = require('../models/ChatModel');
const User = require('../models/UserModel');
const { json } = require('body-parser');

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    console.log("userId : ",userId," req.id : ",req.user._id)
    
    if (!userId) {
        console.log('No user id');
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    var isChat = await Chat.findOne({ 
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
     }).populate('users',"-password").populate("latestMessage");
    
    if (isChat) {
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "email profilePic email"
        });
        res.status(200).json(isChat);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, req.user._id]
        };
        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', "-password");
            console.log(fullChat)
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
            select: "email profilePic email"
        });

            res.status(200).json(fullChat);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name)
       return res.status(400).json({ msg: "please enter all details" });
    var users = JSON.parse(req.body.users);
    if (users.length < 2)
       return res.status(400).json({ msg: "please add atleast 2 users" });
    
    users.push(req.user);

    var chatData = {
        chatName: req.body.name,
        isGroupChat: true,
        users: users,
        groupAdmin: req.user,
    };

    try {
        const createChat = await Chat.create(chatData);

        const fullChat = await Chat.findOne({ _id: createChat._id }).populate('users', "-password").populate("groupAdmin",'-password');
        
        res.status(200).json(fullChat);
    } catch (err) {
        res.status(400).json(err);
    }
})
    
const renameGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.name) {
        return res.status(400).json({ msg: "Please enter all details" });
    }

    console.log(req.body);
    var chatId = req.body.chatId;
    var chatName = req.body.name;

    try {
       
        const updateChat = await Chat.findOneAndUpdate(
            { _id: chatId }, 
            { $set: { chatName } }, 
            { new: true }
        ).populate('users', '-password').populate("groupAdmin", '-password');

    
        if (!updateChat) {
            return res.status(404).json({ msg: "Chat not found" });
        }

        res.status(200).json(updateChat); 
    } catch (err) {
        res.status(500).json(err); // Consider using appropriate status code for database/server errors
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        return res.status(400).json({ msg: "Please enter all details" });
    }

    var chatId = req.body.chatId;
    var userId = req.body.userId;

    const updateChat = await Chat.findOneAndUpdate(
        { _id: chatId },
        { $push: { users: userId } },
        { new: true }
    ).populate('users', '-password').populate("groupAdmin", '-password');

    if (!updateChat) {
        return res.status(404).json({ msg: "Chat not found" });
    } else {
        res.status(200).json(updateChat);
    }
});


const removeFromGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        return res.status(400).json({ msg: "Please enter all details" });
    }

    var chatId = req.body.chatId;
    var userId = req.body.userId;

    const updateChat = await Chat.findOneAndUpdate(
        { _id: chatId },
        { $pull: { users: userId } },
        { new: true }
    ).populate('users', '-password').populate("groupAdmin", '-password');

    if (!updateChat) {
        return res.status(404).json({ msg: "Chat not found" });
    } else {
        res.status(200).json(updateChat);
    }
});



module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
};