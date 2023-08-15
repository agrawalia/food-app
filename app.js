const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(express.json()); // convert data from frontend to json format
app.use(cookieParser());

const userRouter = require("./routers/userRouter");
const planRouter = require("./routers/planRouter");
const reviewRouter = require("./routers/reviewRouter");
const bookingRouter = require("./routers/bookingRouter");
app.listen(3006);

app.use("/users", userRouter); //Base route, router to use
app.use("/plans", planRouter);
app.use("/reviews", reviewRouter);
app.use("/booking", bookingRouter);
