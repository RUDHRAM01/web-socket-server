const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const {db} = require('./db/db');
const userRouter = require('./routes/UserRoutes');
const chatRouter = require('./routes/ChatRoutes');
const messageRouter = require('./routes/messageRoutes');
const StatusRouter = require('./routes/StatusRoutes');
const NotificationRoute = require('./routes/NotificationRoutes');
const Auth = require('./routes/Auth');
const {HeadersChecker} = require('./middleware/HeadersChecker');
const {notFound} = require('./middleware/errorMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');
const limitTracker = require('./middleware/AuthLimiter');
const cookieParser = require('cookie-parser');
const intiSocket = require('./socket');
db();



const checkUserAgent = (req, res, next) => {
    const userAgent = req.get('User-Agent');
    if (!userAgent || !userAgent.includes('Mozilla')) {
        return res.status(403).json({ error: '[High Security] Access denied...' });
    }
    next();
};

app.use(checkUserAgent);

require('dotenv').config();
const allowedOrigins = [
    "http://localhost:3000", // Your local development environment
    "https://chat-app-rs.netlify.app", // Netlify domain
    /google\.app$/,
    /chat-app-rs.netlify\.app$/
  ];

intiSocket(server, allowedOrigins);
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
		'Content-Type',
		'Authorization',
		'Set-Cookie',
		'x-app-type',
		'x-hashed-id',
		'x-request-id',
		'x-request-token',
		'x-fingerprint-id',
	],
}));

app.set('trust proxy', 1);
app.use(bodyParser.json());
app.options('*', cors());
app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
)





app.get('/', (req, res) => {
    res.send('welcome...');
});

app.use('/api/auth',Auth);
app.use('/api/users',[limitTracker,HeadersChecker], userRouter);
app.use('/api/chats',[limitTracker,HeadersChecker], chatRouter);
app.use('/api/messages',[limitTracker,HeadersChecker], messageRouter);
app.use('/api/status', [limitTracker, HeadersChecker], StatusRouter);
app.use('/api/notifications', [limitTracker, HeadersChecker], NotificationRoute);


app.use(notFound);
app.use(errorHandler);


server.listen(4000, () => {

    console.log('Server is running on port 4000');
});