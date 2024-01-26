const NotificationController = require('../controllers/NotificationController');
const { protect } = require('../middleware/authMiddleware');
const NotificationRoute = require("express").Router();

NotificationRoute.get("/", protect, NotificationController.getNotifications);
NotificationRoute.post("/", protect, NotificationController.deleteNotification);


module.exports = NotificationRoute;