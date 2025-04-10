const Ride = require("../models/ride.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");

async function createRideFunction(req, res) {
  try {
    const {
      fullName,
      email,
      phone,
      source,
      destination,
      date,
      timeOfStart,
      seatsAvailable,
    } = req.body;

    try {
      const response = await Ride.create({
        fullName,
        email,
        phone,
        source,
        destination,
        date,
        timeOfStart,
        seatsAvailable,
        members: [{ fullName, email }],
      });
      console.log("Ride Created Successfully: ", response);
      return res.json({ status: 200, message: "Ride Created Successfully!" });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: error.message,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      message: err.message,
    });
  }
}

async function findRideFunction(req, res) {
  try {
    const { source, destination, date } = req.body;
    if (isNaN(new Date(date))) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    const rides = await Ride.find({
      source: { $regex: new RegExp(source, "i") }, // Case-insensitive search
      destination: { $regex: new RegExp(destination, "i") },
      date: new Date(date), // Exact match for date
      seatsAvailable: { $gt: 0 }, // Only rides with available seats
    });

    if (rides.length === 0) {
      return res.json({ success: false, rides: rides });
    }

    return res.json({ success: true, rides: rides });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

async function bookRideFunction(req, res) {
  try {
    const { rideId, fullName, email } = req.body;
    console.log(rideId, fullName, email);
    // Find the ride by ID
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ status: 404, message: "Ride not found" });
    }

    // Check if user is already in the members list
    const isAlreadyBooked = ride.members.some(
      (member) => member.email === email
    );
    if (isAlreadyBooked) {
      return res
        .status(400)
        .json({ status: 400, message: "You have already booked this ride" });
    }

    // Add user to members list
    ride.members.push({ fullName, email });

    // Decrease available seats
    if (ride.seatsAvailable > 0) {
      ride.seatsAvailable -= 1;
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "No seats available" });
    }

    // Save the updated ride
    await ride.save();

    return res.json({
      status: 200,
      message: "Ride booked successfully!",
      ride,
    });
  } catch (error) {
    console.error("Error booking ride:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
}

async function upcomingRideFunction(req, res) {
  try {
    const { email } = req.body;
    const now = new Date();

    const rides = await Ride.find({
      date: { $gte: now },
      "members.email": email,
    });

    return res.json({ status: 200, rides });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Server Error", error });
  }
}

async function cancelRideFunction(req, res) {
  try {
    const { rideId, email } = req.body; // Get rideId and user email
    console.log(rideId, email);
    // Find the ride
    const ride = await Ride.findOne({ rideId });

    if (!ride) {
      return res.status(404).json({ status: 404, message: "Ride not found" });
    }

    // Filter out the user from members list
    const updatedMembers = ride.members.filter(
      (member) => member.email !== email
    );

    // Update the ride's members list
    ride.members = updatedMembers;
    ride.seatsAvailable += 1;
    await ride.save();

    return res.json({
      status: 200,
      message: "You have successfully left the ride",
    });
  } catch (error) {
    console.error("Error canceling ride:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Internal Server Error" });
  }
}

async function pastRidesFunction(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find rides where the user is in the `members` array
    // const pastRides = await Ride.find({
    //   "members.email": email,
    //   date: { $lt: new Date() }, // only include rides before today
    // });

    const allMatchingRides = await Ride.find({
      "members.email": email,
    });

    const now = new Date();

    // Filter rides where combined datetime is in the past
    const pastRides = allMatchingRides.filter((ride) => {
      const rideDate = new Date(ride.date);
      const [hours, minutes] = ride.timeOfStart.split(":").map(Number);
      rideDate.setHours(hours);
      rideDate.setMinutes(minutes);
      rideDate.setSeconds(0);

      return rideDate < now;
    });

    return res.json({ status: 200, pastRides });
  } catch (error) {
    console.error("Error fetching past rides:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function completeRideFunction(req, res) {
  try {
    const { rideId, email } = req.body;

    const ride = await Ride.findOne({ rideId });

    if (!ride) throw new Error("Ride not found");

    if (ride.email !== email) {
      return res.json({
        status: 403,
        message: "Only the host can complete this ride.",
      });
    }

    // Update each member's numberOfRides
    for (const member of ride.members) {
      await User.findOneAndUpdate(
        { email: member.email },
        { $inc: { numberOfRides: 1 } }
      );
    }

    // Optionally mark ride as completed to prevent multiple updates
    ride.completed = true;
    await ride.save();

    return res.json({ status: 200 });
  } catch (error) {
    console.error("Failed marking ride complete:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function addReviewFunction(req, res) {
  const { reviewerEmail, revieweeEmail, rating, comment, rideId } = req.body;
  // if (reviewerEmail || rideId || rating || comment == null) {
  //   return res.json({
  //     status: 400,
  //     message: "Missing required fields.",
  //   });
  // }

  try {
    // Prevent self-reviewing (redundant if handled in frontend too)
    if (reviewerEmail === revieweeEmail) {
      return res.json({ status: 400, message: "Cannot review yourself." });
    }

    // Check if review already exists for this ride by the same reviewer to the same reviewee
    const existing = await Review.findOne({
      rideId,
      reviewerEmail,
      revieweeEmail,
    });
    if (existing) {
      return res.json({
        status: 400,
        message: "You have already reviewed this user",
      });
    }

    // Save to Review collection
    const review = new Review({
      rideId,
      reviewerEmail,
      revieweeEmail,
      rating,
      comment,
    });
    await review.save();

    // Get reviewer name
    const reviewer = await User.findOne({ email: reviewerEmail });
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found." });
    }

    // Push to reviewee's ratings array
    const reviewee = await User.findOneAndUpdate(
      { email: revieweeEmail },
      {
        $push: {
          ratings: {
            reviewerName: reviewer.fullName,
            rating,
            comment,
          },
        },
      },
      { new: true }
    );

    if (!reviewee) {
      return res.status(404).json({ message: "Reviewee not found." });
    }

    return res.json({ status: 200, message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Review submission error:", error);
    res.status(500).json({ message: "Server error." });
  }
}

module.exports = {
  createRideFunction,
  findRideFunction,
  bookRideFunction,
  upcomingRideFunction,
  cancelRideFunction,
  pastRidesFunction,
  completeRideFunction,
  addReviewFunction,
};
