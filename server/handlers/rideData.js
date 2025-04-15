const Ride = require("../models/ride.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const { sendEmail } = require("../utils/email.js");
const moment = require("moment");

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

    const rideDateTime = moment(`${date}T${timeOfStart}`);
    const now = moment();

    if (rideDateTime.isBefore(now)) {
      return res.json({
        status: 400,
        message: "Start time must be in the future.",
      });
    }

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

    const enrichedRides = await Promise.all(
      rides.map(async (ride) => {
        const hostUser = await User.findOne({ email: ride.email }); // assuming email links to host

        return {
          ...ride.toObject(),
          hostAverageRating: hostUser?.averageRating?.toFixed(1) ?? "0.0",
          hostNumberOfRides: hostUser?.numberOfRides ?? 0,
          hostRecentReviews:
            hostUser?.ratings
              ?.slice(-2)
              .reverse()
              .map((r) => ({
                reviewerName: r.reviewerName,
                rating: r.rating,
                comment: r.comment,
              })) ?? [],
          members: ride.members ?? [],
        };
      })
    );
    return res.json({ success: true, rides: enrichedRides });

    // return res.json({ success: true, rides: rides });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
}

async function bookRideFunction(req, res) {
  try {
    const { rideId, fullName, email } = req.body;
    const updatedRide = await Ride.findOneAndUpdate(
      {
        _id: rideId,
        seatsAvailable: { $gt: 0 },
        "members.email": { $ne: email },
      },
      {
        $inc: { seatsAvailable: -1 },
        $push: { members: { fullName, email } },
      },
      { new: true }
    );

    if (!updatedRide) {
      return res.status(400).json({
        status: 400,
        message: "No seats available or you already booked this ride",
      });
    }

    return res.json({
      status: 200,
      message: "Ride booked successfully!",
      ride: updatedRide,
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

    const enrichedRides = await Promise.all(
      rides.map(async (ride) => {
        const hostUser = await User.findOne({ email: ride.email }); // assuming email links to host

        const enrichedMembers = await Promise.all(
          (ride.members ?? []).map(async (member) => {
            const user = await User.findOne({ email: member.email });
            return {
              ...member,
              phone: user?.phone ?? "N/A",
            };
          })
        );

        return {
          ...ride.toObject(),
          hostAverageRating: hostUser?.averageRating?.toFixed(1) ?? "0.0",
          hostNumberOfRides: hostUser?.numberOfRides ?? 0,
          hostRecentReviews:
            hostUser?.ratings
              ?.slice(-2)
              .reverse()
              .map((r) => ({
                reviewerName: r.reviewerName,
                rating: r.rating,
                comment: r.comment,
              })) ?? [],
          members: enrichedMembers ?? [],
        };
      })
    );
    return res.json({ status: 200, rides: enrichedRides });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: "Server Error", error });
  }
}

async function cancelRideFunction(req, res) {
  try {
    const { rideId, email } = req.body;

    const ride = await Ride.findOne({ rideId });
    if (!ride) {
      return res.status(404).json({ status: 404, message: "Ride not found" });
    }

    const isHost = ride.email === email;

    if (isHost) {
      if (ride.members.length === 1) {
        // If no one else is in the ride, delete it
        await Ride.deleteOne({ rideId });
        return res.json({
          status: 200,
          message: "Ride deleted as there were no other members",
        });
      } else {
        // Promote the first member to host (don't remove them from members array)
        const newHostBasic = ride.members[1];

        // Fetch full user details from User model
        const newHostUser = await User.findOne({ email: newHostBasic.email });
        console.log(newHostUser);
        if (!newHostUser) {
          return res
            .status(404)
            .json({ status: 404, message: "New host not found in users" });
        }

        // Update ride with full new host details
        ride.fullName = newHostUser.fullName;
        ride.email = newHostUser.email;
        ride.phone = newHostUser.phone;

        // Remove the original host from members array
        ride.members = ride.members.filter((member) => member.email !== email);
        ride.seatsAvailable += 1;
        await ride.save();

        // Send email to new host
        try {
          await sendEmail({
            to: newHostUser.email,
            subject: "You're now the host of a UniRide!",
            text: `Hi ${
              newHostUser.fullName
            },\n\nYou've been promoted as the new host of the ride from ${
              ride.source
            } to ${
              ride.destination
            } on ${ride.date.toDateString()}.\n\nYou can now manage this ride in your dashboard.\n\nThanks,\nUniRide Team 🚗`,
          });
        } catch (error) {
          console.log(error);
        }

        return res.json({
          status: 200,
          message: "You have left the ride and a new host has been assigned",
        });
      }
    } else {
      // User is just a member
      ride.members = ride.members.filter((member) => member.email !== email);
      ride.seatsAvailable += 1;
      await ride.save();

      return res.json({
        status: 200,
        message: "You have successfully left the ride",
      });
    }
  } catch (error) {
    console.error("Error canceling ride:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
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

    const ridesWithHostRating = await Promise.all(
      pastRides.map(async (ride) => {
        const hostUser = await User.findOne({ email: ride.email }); // Don't use .lean()

        return {
          ...ride.toObject(), // convert ride doc to plain object
          hostAverageRating: hostUser?.averageRating?.toFixed(1) ?? "0.0",
        };
      })
    );

    return res.json({ status: 200, pastRides: ridesWithHostRating });

    // return res.json({ status: 200, pastRides });
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

    // if (ride.email !== email) {
    //   return res.json({
    //     status: 403,
    //     message: "Only the host can complete this ride.",
    //   });
    // }

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
