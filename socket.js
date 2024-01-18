const SocketIo = require('socket.io');

let sockets = {};
const addUserToSocket = (socket, userId) => {
    sockets[userId] = socket.id;
}

const removeUserFromSocket = (socketId) => {
    Object.keys(sockets).forEach(key => {
        if (sockets[key] === socketId) delete sockets[key];
    })
}

const getUserSocket = (userId) => {
    if (!sockets[userId]) return null;
    return sockets[userId];
}


function initSocket(server, allowedOrigins) {
    const io = SocketIo(server, {
        pingTimeout: 60000,
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true
        }

    });

    io.on('connection', (socket) => {
        socket.on("add", id => {
            addUserToSocket(socket, id);
            io.to(socket.id).emit("connected");
        });

        socket.on("disconnect", () => {
            removeUserFromSocket(socket.id);
        });


        socket.on("new message", (newMessageReceived) => {
            if (!newMessageReceived.users) return console.log("Chat.users not defined");

            newMessageReceived.users.forEach((user) => {
                if (user._id === newMessageReceived.sender) return;
                const userSocket = getUserSocket(user._id);
                if (!userSocket) return;
                io.to(userSocket).emit("message received", newMessageReceived);
            })
        })

        socket.on("typing", room => {
            const userSocket = getUserSocket(room.to);
            if (!userSocket) return;
            io.to(userSocket).emit("typing", room.room);
        });

        socket.on("stopTy", room => {
            const userSocket = getUserSocket(room.to);
            if (!userSocket) return;
            io.to(userSocket).emit("stopTy", room.room);
        });
    })
    
}

module.exports = initSocket;
