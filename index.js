const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');
const db = require('./db/db');
const userRouter = require('./routes/UserRoutes');
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());

app.use('/api/users', userRouter);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
    db();
});