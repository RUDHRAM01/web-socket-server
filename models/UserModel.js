const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '/img/download.jpg'
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;