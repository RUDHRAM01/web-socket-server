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

require('dotenv').config();
const allowedOrigins = [
    "http://localhost:3000", // Your local development environment
    "https://chat-app-rs.netlify.app", // Netlify domain
    /google\.app$/,
    /chat-app-rs.netlify\.app$/
  ];
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

app.use(bodyParser.json());
app.options('*', cors());
app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
)


intiSocket(server, allowedOrigins);


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