const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    seen: {
        type: String,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;