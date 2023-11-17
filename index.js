const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');
const db = require('./db/db');
const userRouter = require('./routes/UserRoutes');
const chatRouter = require('./routes/ChatRoutes');
const messageRouter = require('./routes/messageRoutes')
const {notFound} = require('./middleware/errorMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');


require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());



app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/message', messageRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(4000, () => {
    console.log('Server is running on port 4000');
    db();
});