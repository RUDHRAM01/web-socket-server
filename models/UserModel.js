const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 20,
    },
    email: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '/img/download.jpg'
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;