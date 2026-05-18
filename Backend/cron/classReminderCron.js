import cron from "node-cron";
import Booking from "../model/bookingModel.js";
import sendMail from "../utils/reminderClass.js";

console.log("🕒 Class reminder cron registered");

const runClassReminder = async () => {
  try {
    const now = new Date();
    const inTenMinutes = new Date(now.getTime() + 10 * 60 * 1000);

    console.log("⏰ Checking upcoming classes...");

    const bookings = await Booking.find({
      status: "Scheduled",
      notified: { $ne: true },
    })
      .populate({
        path: "class",
        select: "name startTime",
      })
      .populate({
        path: "user",
        select: "email name",
      });

    console.log("📊 Found bookings:", bookings.length);

    for (const booking of bookings) {
      console.log("BOOKING ID:", booking._id);
      console.log("CLASS EXISTS:", !!booking.class);
      console.log("USER EMAIL:", booking.user?.email);
      console.log("NOTIFIED:", booking.notified);

      if (!booking.class || !booking.user?.email) {
        console.log("⏭ Skipping booking because class or email is missing");
        continue;
      }

      const classStart = new Date(booking.class.startTime);
      const isWithinReminderWindow =
        classStart >= now && classStart <= inTenMinutes;

      console.log("CLASS START:", classStart);
      console.log("WITHIN 10 MIN:", isWithinReminderWindow);

      if (!isWithinReminderWindow) {
        console.log("⏭ Skipping because class is not within reminder window");
        continue;
      }

      console.log("📨 Sending reminder to:", booking.user.email);

      await sendMail({
        to: booking.user.email,
        subject: `Reminder: ${booking.class.name} starts soon`,
        text: `Your class starts at ${new Date(
          booking.class.startTime
        ).toLocaleString()}`,
        html: `
          <h2>Class Reminder</h2>
          <p>Hello ${booking.user.name || "User"},</p>
          <p>Your class <strong>${booking.class.name}</strong> starts soon.</p>
          <p><strong>Start Time:</strong> ${new Date(
            booking.class.startTime
          ).toLocaleString()}</p>
        `,
      });

      console.log("✅ Reminder email sent");

      booking.notified = true;
      await booking.save();
    }
  } catch (error) {
    console.error("❌ Class reminder cron error:", error);
  }
};

cron.schedule("* * * * *", runClassReminder);

export default runClassReminder;