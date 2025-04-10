const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rideId: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  revieweeEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
