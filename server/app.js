const express = require("express");
const app = express();

app.use(express.json());

const uRoutes = require("./routes/userRoute.js");

app.use("/user", uRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

module.exports = app;
