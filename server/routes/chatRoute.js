const express = require("express");
const router = express.Router();
const ChatMessage = require("../models/chatMessage");

router.get("/:rideId", async (req, res) => {
  try {
    const messages = await ChatMessage.find({ rideId: req.params.rideId });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
