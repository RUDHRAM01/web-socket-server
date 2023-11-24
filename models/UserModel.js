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
        default: 'https://th.bing.com/th?id=OIP._6kSqsTmX5o4yeSjGnw48AHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2'
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;