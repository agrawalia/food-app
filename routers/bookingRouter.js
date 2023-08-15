const express = require("express");
const { protectRoute } = require("../controller/authController");
const { createSession } = require("../controller/bookingController");
const app = express();
const bookingRouter = express.Router();

bookingRouter.post('/createSession',protectRoute, createSession);
bookingRouter.get('/createSession', function(req, res) {
    res.sendFile('/Users/ishan/workspace/test/views/booking.html');
})

module.exports=bookingRouter;

