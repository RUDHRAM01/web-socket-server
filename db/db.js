const mongoose = require('mongoose');
let connection = null;
const check = function () {
    console.log(connection)
    console.log(process.env.MONGO_URI)
};

const db = function () {
    try {
        mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');
        connection = true;
    }catch(err){
        console.log(err);
        connection = false;
    }
};

module.exports = {
    check,
    db
}