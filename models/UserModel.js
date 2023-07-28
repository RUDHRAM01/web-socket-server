const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        default: '/images/profilePic.png'
    },
    email: {
        type: String,
        required: true,
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