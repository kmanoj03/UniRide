const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  rideId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(), // Auto-generated unique ID
  },
  fullName: {
    type: String,
    required: [true, "Full Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required!"],
  },
  source: {
    type: String,
    required: [true, "Source location is required!"],
  },
  destination: {
    type: String,
    required: [true, "Destination location is required!"],
  },
  date: {
    type: Date,
    required: [true, "Date of ride is required!"],
  },
  timeOfStart: {
    type: String,
    required: [true, "Time of start is required!"],
  },
  seatsAvailable: {
    type: Number,
    required: [true, "Number of seats available is required!"],
    min: [0, "Seats cannot be less than 0!"], // Minimum 0 when booking
  },
  members: [
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Ride", rideSchema);
