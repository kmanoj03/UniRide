const express = require("express");
const router = express.Router();

const createRide = require("../handlers/rideData.js");
const findRide = require("../handlers/rideData.js");
const bookRide = require("../handlers/rideData.js");
const upcomingRide = require("../handlers/rideData.js");
const cancelRide = require("../handlers/rideData.js");

router.post("/create", createRide.createRideFunction);
router.post("/find", findRide.findRideFunction);
router.post("/book", bookRide.bookRideFunction);
router.post("/upcoming", upcomingRide.upcomingRideFunction);
router.post("/cancel", cancelRide.cancelRideFunction);

module.exports = router;
