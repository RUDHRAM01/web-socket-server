const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');
const db = require('./db/db');
const userRouter = require('./routes/UserRoutes');
const chatRouter = require('./routes/ChatRoutes');
const {notFound} = require('./middleware/errorMiddleware');
const {errorHandler} = require('./middleware/errorMiddleware');

require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());

app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    db();
});