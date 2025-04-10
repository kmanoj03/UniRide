const cron = require("node-cron");
const Ride = require("../models/ride");
const User = require("../models/user");

cron.schedule("*/10 * * * *", async () => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const rides = await Ride.find({
      completed: false,
      $or: [
        { date: { $lt: todayStr } },
        {
          date: todayStr,
          timeOfStart: { $lt: now.toTimeString().slice(0, 5) }, // compare "HH:MM"
        },
      ],
    });

    for (let ride of rides) {
      ride.completed = true;
      await ride.save();

      const emails = [ride.email, ...ride.members.map((m) => m.email)];
      await User.updateMany(
        { email: { $in: emails } },
        { $inc: { numberOfRides: 1 } }
      );
    }

    if (rides.length > 0) {
      console.log(`[Cron] Updated ${rides.length} completed rides`);
    }
  } catch (err) {
    console.error("[Cron] Error:", err);
  }
});
