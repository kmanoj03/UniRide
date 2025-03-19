const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "First Name is required!"],
  },
  email: {
    type: String,
    required: [true, "Email ID is required!"],
    unique: [true, "Email Id Already Registered"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  phone: {
    type: String,
    required: [true, "Phone Number is required!"],
    unique: [true, "Phone Number already exists!"],
  },
  numberOfRides: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", userSchema);
