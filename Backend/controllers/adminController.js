
import MembershipPlan from "../model/memberShipPlan.js";
import Class from "../model/classModel.js";
import User from "../model/userModel.js";
import Booking from "../model/bookingModel.js";

export const createMembershipPlan = async (req, res) => {
  try {
    const { name, duration, price, canHireTrainer } = req.body;

    if (!name || !duration || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedName = name.trim();

    const exists = await MembershipPlan.findOne({
      name: trimmedName,
      duration,
    });

    if (exists) {
      return res.status(400).json({
        message: "This plan with the same duration already exists",
      });
    }

    const plan = await MembershipPlan.create({
      name: trimmedName,
      duration,
      price: Number(price),
      canHireTrainer: Boolean(canHireTrainer),
      isActive: true,
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(500).json({
      message: error.message || "Failed to create membership plan",
    });
  }
};
export const deleteMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    await plan.deleteOne();
    res.status(200).json({ _id: plan._id, message: "Plan deleted successfully" }); 
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan" });
  }
};


export const getAllMembershipPlans = async (req, res) => {
  const plans = await MembershipPlan.find().sort({ createdAt: -1 });
  res.status(200).json(plans);
};

export const getActiveMemberships = async (req, res) => {
  try {
    const users = await User.find({
      "membership.status": "Active",
    })
      .populate("membership.plan", "name duration price")
      .select("name email membership")
      .sort({ "membership.purchasedAt": -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get active memberships error:", error.message);
    res.status(500).json({ message: "Failed to fetch active memberships" });
  }
};

export const deactivateMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.membership) {
      return res.status(404).json({ message: "User or membership not found" });
    }

    user.membership.status = "Cancelled";
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Deactivate membership error:", error.message);
    res.status(500).json({ message: "Failed to deactivate membership" });
  }
};


export const createClass = async (req, res) => {
  try {
    const { name, description, trainerName, startTime, durationMinutes, slots } = req.body;

    if (!name || !trainerName || !startTime || !durationMinutes || !slots) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trainerExists = await User.findOne({
      name: trainerName.trim(),
      role: "trainer",
      isActive: true,
    });

    if (!trainerExists) {
      return res.status(400).json({ message: "Invalid trainer name" });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + Number(durationMinutes) * 60000);

    const conflictingClass = await Class.findOne({
      trainer: trainerExists._id,
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { $and: [{ startTime: { $lte: start } }, { endTime: { $gte: end } }] }
      ]
    });

    if (conflictingClass) {
      return res.status(400).json({
        message: "Trainer has a conflicting class during this time"
      });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const newClass = await Class.create({
      name,
      description,
      trainer: trainerExists._id,
      startTime: start,
      endTime: end, 
      durationMinutes: Number(durationMinutes),
      slots: Number(slots),
      image,
    });

    res.status(201).json(newClass);
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({ message: "Failed to create class" });
  }
};


export const updateClass = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    cls.name = req.body.name || cls.name;
    cls.description = req.body.description || cls.description;
if (req.body.trainerName) {
  const trainerExists = await User.findOne({
    name: req.body.trainerName.trim(),
    role: "trainer",
    isActive: true,
  });

  if (!trainerExists) {
    return res.status(400).json({ message: "Invalid trainer name" });
  }

  cls.trainer = trainerExists._id;
}
if (req.body.slots) {
  if (req.body.slots < cls.bookedSlots) {
    return res.status(400).json({
      message: "Slots cannot be less than booked slots",
    });
  }
  cls.slots = req.body.slots;
}
if (req.body.startTime && req.body.durationMinutes) {
  const start = new Date(req.body.startTime);
  cls.startTime = start;
  cls.durationMinutes = Number(req.body.durationMinutes);
  cls.endTime = new Date(start.getTime() + cls.durationMinutes * 60000);
}

if (req.body.trainerName || (req.body.startTime && req.body.durationMinutes)) {
  const trainerId = req.body.trainerName ? (await User.findOne({ name: req.body.trainerName.trim(), role: "trainer", isActive: true }))?._id : cls.trainer;
  const startTime = req.body.startTime ? new Date(req.body.startTime) : cls.startTime;
  const endTime = req.body.durationMinutes
    ? new Date(startTime.getTime() + Number(req.body.durationMinutes) * 60000)
    : cls.endTime;

  const conflictingClass = await Class.findOne({
    trainer: trainerId,
    _id: { $ne: cls._id }, 
    $or: [
      { startTime: { $lt: endTime, $gte: startTime } },
      { endTime: { $gt: startTime, $lte: endTime } },
      { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
    ]
  });

  if (conflictingClass) {
    return res.status(400).json({
      message: "Trainer has a conflicting class during this time"
    });
  }
}

    if (req.file) cls.image = `/uploads/${req.file.filename}`;

    await cls.save();
    res.status(200).json(cls);
  } catch (error) {
    console.error("Update class error:", error.message);
    res.status(500).json({ message: "Failed to update class" });
  }
};


export const deleteClass = async (req, res) => {
  try {
    const cls = await Class.findByIdAndDelete(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    res.status(200).json({ _id: cls._id, message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error.message);
    res.status(500).json({ message: "Failed to delete class" });
  }
};

export const getAllClassesAdmin = async (req, res) => {
  try {
    const classes = await Class.find().populate("trainer", "name email").sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Fetch classes error:", error.message);
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

export const getClassDetailsAdmin = async (req, res) => {
  try {
    const cls = await Class.findById(req.params.id)
      .populate("trainer", "name email");

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (!cls.startTime || !cls.endTime) {
      return res.status(500).json({
        message: "Class timing data is invalid",
      });
    }

    const now = new Date();

    const hasStarted = now >= new Date(cls.startTime);
    const hasEnded = now >= new Date(cls.endTime);

    const isBookable =
      !hasStarted &&
      !hasEnded &&
      cls.bookedSlots < cls.slots;

    res.status(200).json({
      ...cls.toObject(),
      hasStarted,
      hasEnded,
      isBookable,
      remainingSlots: Math.max(
        cls.slots - cls.bookedSlots,
        0
      ),
    });
  } catch (error) {
    console.error("Fetch class details error:", error);
    res.status(500).json({ message: "Failed to fetch class details" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch users error:", error.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    await user.deleteOne();
    res.status(200).json({ _id: user._id, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const reopenClass = async (req, res) => {
  try {
    const { startTime, durationMinutes, slots } = req.body;

    if (!startTime || !durationMinutes || !slots) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const cls = await Class.findById(req.params.id);
    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    const newStart = new Date(startTime);
    const newEnd = new Date(
      newStart.getTime() + Number(durationMinutes) * 60000
    );

    await Booking.updateMany(
      {
        class: cls._id,
        status: "Scheduled",
      },
      {
        $set: {
          status: "Completed",
          attended: false,
          qrToken: null,
          qrImage: null,
          qrExpiresAt: null,
        },
      }
    );

    cls.startTime = newStart;
    cls.endTime = newEnd;
    cls.durationMinutes = Number(durationMinutes);
    cls.slots = Number(slots);
    cls.reopenedAt = new Date();
    cls.bookedSlots = 0;
    cls.adminReopen = true;

    if (req.file) {
      cls.image = `/uploads/${req.file.filename}`;
    }

    await cls.save();

    res.status(200).json(cls);
  } catch (error) {
    console.error("Reopen class error:", error);
    res.status(500).json({ message: "Failed to reopen class" });
  }
};
export const createTrainer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const trainer = await User.create({
      name,
      email,
      password,
      role: "trainer",
      image,
      isActive: true,
    });

    res.status(201).json({
      _id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role,
      image: trainer.image,
    });
  } catch (error) {
    console.error("Create trainer error:", error.message);
    res.status(500).json({ message: "Failed to create trainer" });
  }
};

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trainers" });
  }
};

export const toggleTrainerStatus = async (req, res) => {
  try {
    const trainer = await User.findById(req.params.id);

    if (!trainer || trainer.role !== "trainer") {
      return res.status(404).json({ message: "Trainer not found" });
    }

    const updatedTrainer = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: !trainer.isActive },
      { new: true }
    );

    res.status(200).json({
      _id: updatedTrainer._id,
      isActive: updatedTrainer.isActive,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update trainer status" });
  }
};


