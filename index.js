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
const server = app.listen(4000, () => {
    console.log('Server is running on port 4000');
    db();
});

const io = require('socket.io')(server, {
    pingTimeout : 60000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on('connection', (socket) => {
    console.log("connected to socket.io");
    socket.on("setup", userData => {
        socket.join(userData.id);
        console.log(userData.id);
        socket.emit("connected");
    });

    socket.on("join chat", room => socket.join(room));

});
