

const router = require('express').Router();
const userController = require('../controllers/userController');


router.get("/verify", userController.verify);


module.exports = router;

