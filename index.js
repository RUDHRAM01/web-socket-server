const express = require('express');
const app = express();
const chats = require('./data/data');

app.get('/', (req, res) => {
    res.send('Hello from socket 1');
});

app.get('/api/chat/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const chat = chats.find(chat => chat._id === id);
    res.send(chat);
});

app.get('/api/chat', (req, res) => {
    res.send(chats);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});