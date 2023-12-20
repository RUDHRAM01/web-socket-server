const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    expirationDate: {
        type: Date,
        // Set default to one day from now
        default: () => new Date(+new Date() + 1 * 24 * 60 * 60 * 1000),
      },
}, { timestamps: true });


const Status = mongoose.model('Status', StatusSchema);
module.exports = Status;
