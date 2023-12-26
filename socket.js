const SocketIo = require('socket.io')
function initSocket(server, allowedOrigins) {
    const io = SocketIo(server, {
        pingTimeout: 60000,
        cors: {
            origin: allowedOrigins,
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
            socket.in(room).emit("typing", room);
        });

        socket.on("stopTy", room => {
            socket.in(room).emit("stopTy", room);
        });
    })
    
}

module.exports = initSocket;
