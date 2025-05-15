const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "https://uniride-frontend.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

const uRoutes = require("./routes/userRoute.js");
const rRoutes = require("./routes/rideRoute.js");
const chatRoutes = require("./routes/chatRoute.js");

app.use("/user", uRoutes);
app.use("/ride", rRoutes);
app.use("/chat", chatRoutes);

require("./cron/rideCompletionCron.js");

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = app;
