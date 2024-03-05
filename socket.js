const SocketIo = require('socket.io');
const NotificationModel = require("./models/NotificationModel")


let sockets = {};
let current = {};
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

const addCurrentToSocket = (curr, userId) => {
    current[userId] = curr;
}


const getCurrent = (userId) => {
    if (!current[userId]) return null;
    return current[userId];
}

const removeCurrent = (userId) => {
    delete current[userId];
}

const addNotification = (notificationData) => {
    NotificationModel.create({
        for: notificationData?.to,
        from: notificationData?.from,
        chatId: notificationData?.chat,
    })
}

function initSocket(server, allowedOrigins) {
    if (!server) return console.log("Server not found");
    if (!allowedOrigins) return console.log("Allowed origins not found");


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

        socket.on("updateCurrent", (data) => {
            addCurrentToSocket(data.chatId, data.userId);
        });

        socket.on('disconnectCurr', (userId) => {
            removeCurrent(userId);
        })

        socket.on("disconnect", () => {
            removeUserFromSocket(socket.id);
        });

        socket.on('receive notification', async (notificationData) => {
            const userSocket = getUserSocket(notificationData.to);
            if (!userSocket) {
                return await addNotification(notificationData);
            };
            const currentSocket = getCurrent(notificationData.to);
            if (notificationData.chat !== currentSocket) {
                await addNotification(notificationData);
                io.to(userSocket).emit("notification received");
            }
        })

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
