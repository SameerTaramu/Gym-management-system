import User from "../model/userModel.js";
import TrainerHire from "../model/trainerHireModel.js";
import sendTrainerHireMail from "../utils/sendTrainerHireEmail.js";
import sendTrainerCancelMail from "../utils/sendTrainerCanelMail.js";

export const getAvailableTrainers = async (req, res) => {
  try {
    const trainers = await User.find({
      role: "trainer",
      isActive: true,
    }).select("name email image");

    res.status(200).json(trainers);
  } catch (error) {
    console.error("Get trainers error:", error);
    res.status(500).json({ message: "Failed to fetch trainers" });
  }
};

export const hireTrainer = async (req, res) => {
  try {
    const { trainerId, periodType } = req.body;

    if (!trainerId) {
      return res.status(400).json({ message: "Trainer ID is required" });
    }

    if (!periodType || !["weekly", "monthly"].includes(periodType)) {
      return res.status(400).json({
        message: "Valid hiring period is required",
      });
    }

    const user = await User.findById(req.user._id).populate("membership.plan");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.membership || user.membership.status !== "Active") {
      return res.status(403).json({
        message: "An active membership is required to hire a trainer",
      });
    }

    if (!user.membership.plan || !user.membership.plan.canHireTrainer) {
      return res.status(403).json({
        message: "Your membership plan does not allow trainer hiring",
      });
    }

    const trainer = await User.findOne({
      _id: trainerId,
      role: "trainer",
      isActive: true,
    });

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const existingActiveHire = await TrainerHire.findOne({
      user: req.user._id,
      status: "Active",
    }).populate("trainer", "name");

    if (existingActiveHire) {
      return res.status(400).json({
        message: `You already hired ${
          existingActiveHire.trainer?.name || "a trainer"
        }. Cancel current trainer first.`,
      });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);

    if (periodType === "weekly") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (periodType === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const hire = await TrainerHire.create({
      user: req.user._id,
      trainer: trainerId,
      periodType,
      startDate,
      endDate,
      status: "Active",
    });

    const populatedHire = await TrainerHire.findById(hire._id)
      .populate("user", "name email")
      .populate("trainer", "name email image");

    if (trainer.email) {
      try {
        await sendTrainerHireMail({
          email: trainer.email,
          trainerName: trainer.name,
          userName: user.name,
          periodType,
          startDate,
          endDate,
        });
        console.log("✅ Trainer hire email sent");
      } catch (mailError) {
        console.error("❌ Trainer hire email failed:", mailError.message);
      }
    }

    res.status(201).json({
      message: "Trainer hired successfully",
      hire: populatedHire,
    });
  } catch (error) {
    console.error("Hire trainer error:", error);
    res.status(500).json({ message: "Failed to hire trainer" });
  }
};
export const getMyHiredTrainers = async (req, res) => {
  try {
    const hires = await TrainerHire.find({
      user: req.user._id,
    })
      .populate("trainer", "name email image")
      .sort({ createdAt: -1 });

    res.status(200).json(hires);
  } catch (error) {
    console.error("Get my hired trainers error:", error);
    res.status(500).json({ message: "Failed to fetch hired trainers" });
  }
};

export const getTrainerClients = async (req, res) => {
  try {
    const hires = await TrainerHire.find({
      trainer: req.user._id,
    })
      .populate("user", "name email image membership")
      .sort({ createdAt: -1 });

    res.status(200).json(hires);
  } catch (error) {
    console.error("Get trainer clients error:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

export const cancelTrainerHire = async (req, res) => {
  try {
    const hire = await TrainerHire.findById(req.params.id)
      .populate("user", "name email")
      .populate("trainer", "name email");

    if (!hire) {
      return res.status(404).json({ message: "Hire record not found" });
    }

    if (hire.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (hire.status !== "Active") {
      return res.status(400).json({ message: "Hire is not active" });
    }

    hire.status = "Cancelled";
    await hire.save();

    if (hire.trainer?.email) {
      try {
        await sendTrainerCancelMail({
          email: hire.trainer.email,
          trainerName: hire.trainer.name,
          userName: hire.user.name,
          periodType: hire.periodType,
          startDate: hire.startDate,
          endDate: hire.endDate,
        });
        console.log("✅ Trainer cancel email sent");
      } catch (mailError) {
        console.error("❌ Trainer cancel email failed:", mailError.message);
      }
    }

    res.status(200).json({ message: "Trainer hire cancelled successfully" });
  } catch (error) {
    console.error("Cancel trainer hire error:", error);
    res.status(500).json({ message: "Failed to cancel trainer hire" });
  }
};