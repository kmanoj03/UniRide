const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [
      "https://uniride-frontend.vercel.app",
      "https://uniride-ebon.vercel.app",
    ];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

const uRoutes = require("./routes/userRoute.js");
const rRoutes = require("./routes/rideRoute.js");

app.use("/api/user", uRoutes);
app.use("/api/ride", rRoutes);

require("./cron/rideCompletionCron.js");

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = app;
