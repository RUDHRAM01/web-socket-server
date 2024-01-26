const Notification = require('../models/NotificationModel');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ for: req.user._id, seen: false }).populate('from', 'name profilePic');
        res.status(200).json( notifications );
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}  

const deleteNotification = async (req, res) => {
    
    try {
        await Notification.updateMany({ for: req.body.for, from: req.body.from }, { seen: true }) 
        const notifications = await Notification.find({ for: req.user._id, seen: false }).populate('from', 'name profilePic');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
}

module.exports = { getNotifications, deleteNotification };