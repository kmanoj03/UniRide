const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  reviewerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
  },
});

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
  resetCode: { type: String, default: null },
  resetCodeExpiry: { type: Date, default: null },
  ratings: [ratingSchema], // Array of ratings
});

// Virtual to calculate average rating
userSchema.virtual("averageRating").get(function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, rating) => total + rating.rating, 0);
  return sum / this.ratings.length;
});

module.exports = mongoose.model("User", userSchema);
