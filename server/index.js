require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const socketIO = require("socket.io");
const app = require("./app.js");
const ChatMessage = require("./models/chatMessage");

const MONGO_URI = process.env.MONGO_URI;

// Connect to DB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database is connected!"))
  .catch((err) => console.error(err));

// Set up HTTP + WebSocket Server
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "https://uniride-frontend.onrender.com",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", (rideId) => {
    socket.join(rideId);
  });

  socket.on("send-message", async ({ rideId, sender, senderName, content }) => {
    try {
      const message = await ChatMessage.create({
        rideId,
        sender,
        senderName,
        content,
      });

      io.to(rideId).emit("receive-message", {
        id: message._id,
        sender,
        senderName,
        content,
        timestamp: message.timestamp,
      });
    } catch (err) {
      console.error("Failed to save message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 814;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
