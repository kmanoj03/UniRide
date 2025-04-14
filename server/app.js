const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const uRoutes = require("./routes/userRoute.js");
const rRoutes = require("./routes/rideRoute.js");

app.use("/user", uRoutes);
app.use("/ride", rRoutes);
app.use(
  cors({
    origin: "https://uniride-frontend.vercel.app", // or your frontend domain
    credentials: true,
  })
);

require("./cron/rideCompletionCron.js");

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = app;
