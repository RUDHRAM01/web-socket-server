const mongoose = require('mongoose');

const db = function () {
    try {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');
    }catch(err){
        console.log(err);
    }
};

module.exports = db;