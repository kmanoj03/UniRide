const express = require("express");
const router = express.Router();

const createRide = require("../handlers/rideData.js");
const findRide = require("../handlers/rideData.js");
const bookRide = require("../handlers/rideData.js");
const upcomingRide = require("../handlers/rideData.js");
const cancelRide = require("../handlers/rideData.js");
const pastRide = require("../handlers/rideData.js");
const completeRide = require("../handlers/rideData.js");
const addReview = require("../handlers/rideData.js");

router.post("/create", createRide.createRideFunction);
router.post("/find", findRide.findRideFunction);
router.post("/book", bookRide.bookRideFunction);
router.post("/upcoming", upcomingRide.upcomingRideFunction);
router.post("/cancel", cancelRide.cancelRideFunction);
router.post("/past", pastRide.pastRidesFunction);
router.post("/complete", completeRide.completeRideFunction);
router.post("/review", addReview.addReviewFunction);

module.exports = router;
