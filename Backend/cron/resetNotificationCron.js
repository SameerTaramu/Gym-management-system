import cron from "node-cron";
import Booking from "../model/bookingModel.js";

console.log("🕒 Notification reset cron registered");

const resetNotifications = async () => {
  try {
    const now = new Date();

    await Booking.updateMany(
      {
        qrExpiresAt: { $lt: now },
        notified: true,
      },
      {
        notified: false,
      }
    );

    console.log("🔄 Notifications reset checked");

  } catch (error) {
    console.error("❌ Reset cron error:", error);
  }
};

cron.schedule("*/10 * * * *", resetNotifications);

export default resetNotifications;