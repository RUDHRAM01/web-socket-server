const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const chats = require('./data/data');

app.use(cors());
app.use(bodyParser.json());
app.options('*', cors());
app.get('/', (req, res) => {
    res.send('Hello from socket 1');
});

app.get('/api/chat/:id', (req, res) => {
    const id = req.params.id;
    const chat = chats.find(chat => chat._id === id);
    res.send(chat);
});

app.get('/api/chats', (req, res) => {
    res.send(chats);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});