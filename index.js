const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');
const db = require('./db/db');
const userRouter = require('./routes/UserRoutes');
const chatRouter = require('./routes/ChatRoutes');
const messageRouter = require('./routes/messageRoutes')
const Auth = require('./routes/Auth');
const {notFound} = require('./middleware/errorMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());



app.use('/api/auth',Auth);
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);

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
    socket.on("setup", id => {
        socket.join(id);
        socket.emit("connected");
    });

    socket.on("join chat", room => {
        socket.join(room);
        
    });

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!newMessageReceived.users) return console.log("Chat.users not defined");

        newMessageReceived.users.forEach((user) => {
            if (user._id === newMessageReceived.sender) return;
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })

    socket.on("typing", room => {
        socket.in(room).emit("typing",room);
    });

    socket.on("stopTy", room => {
        socket.in(room).emit("stopTy",room);
    });
});
