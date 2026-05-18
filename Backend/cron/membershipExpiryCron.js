import cron from "node-cron";
import User from "../model/userModel.js";
import sendMail from "../utils/reminderClass.js";

console.log("🕒 Membership expiry cron registered");

const runMembershipExpiry = async () => {
  try {
    const now = new Date();

    const expiredUsers = await User.find({
      "membership.status": "Active",
      "membership.endDate": { $lt: now },
    });

    console.log("📊 Expiring memberships:", expiredUsers.length);

    for (const user of expiredUsers) {
      if (user.email) {
        console.log("📨 Sending expiry email to:", user.email);

        await sendMail({
          to: user.email,
          subject: "Membership Expired",
          text: "Your gym membership has expired.",
          html: `
            <h2>Membership Expired</h2>

            <p>Hello ${user.name},</p>

            <p>
              Your gym membership has expired.
            </p>

            <p>
              Please renew your membership
              to continue booking classes.
            </p>
          `,
        });
      }
    }

    const result = await User.updateMany(
      {
        "membership.status": "Active",
        "membership.endDate": { $lt: now },
      },
      {
        $set: { "membership.status": "Expired" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `🕛 Membership Expiry Cron: ${result.modifiedCount} memberships expired`
      );
    }

  } catch (error) {
    console.error("❌ Membership expiry cron error:", error);
  }
};

cron.schedule("* * * * *", runMembershipExpiry);

export default runMembershipExpiry;