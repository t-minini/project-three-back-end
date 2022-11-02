const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db.config")();

const app = express();

app.use(express.json());

app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "https://wheretogo-tm.netlify.app");
  req.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  req.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

app.use(cors({ origin: process.env.REACT_APP_URL }));

const uploadImgRouter = require("./routes/uploadimg.routes");
app.use("/", uploadImgRouter);

const userRouter = require("./routes/user.routes");
app.use("/user", userRouter);

const tripRouter = require("./routes/trip.routes");
app.use("/trip", tripRouter);

const orderRouter = require("./routes/order.routes");
app.use("/order", orderRouter);

app.listen(Number(process.env.PORT), () => {
  console.log("Server up at port: ", process.env.PORT);
});
