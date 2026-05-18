import cron from "node-cron";
import TrainerHire from "../model/trainerHireModel.js";
import sendMail from "../utils/reminderClass.js";

console.log("🕒 Trainer hire expiry cron registered");

const runTrainerHireExpiry = async () => {
  try {
    const now = new Date();

    const expiredHires = await TrainerHire.find({
      status: "Active",
      endDate: { $lt: now },
    })
      .populate("user", "name email")
      .populate("trainer", "name");

    console.log("📊 Expired hires:", expiredHires.length);

    for (const hire of expiredHires) {
      if (hire.user?.email) {

        console.log("📨 Sending trainer expiry email");

        await sendMail({
          to: hire.user.email,
          subject: "Trainer Hire Completed",
          text: "Your trainer hire period has ended.",
          html: `
            <h2>Trainer Hire Completed</h2>

            <p>Hello ${hire.user.name},</p>

            <p>
              Your trainer 
              <strong>${hire.trainer.name}</strong>
              hire period has ended.
            </p>

            <p>
              If you wish to continue,
              please hire the trainer again.
            </p>
          `,
        });
      }
    }

    const result = await TrainerHire.updateMany(
      {
        status: "Active",
        endDate: { $lt: now },
      },
      {
        $set: { status: "Completed" },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `✅ Trainer hire expiry cron: ${result.modifiedCount} hires completed`
      );
    }

  } catch (error) {
    console.error("❌ Trainer hire expiry cron error:", error);
  }
};

cron.schedule("* * * * *", runTrainerHireExpiry);

export default runTrainerHireExpiry;