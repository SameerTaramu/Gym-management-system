import User from "../model/userModel.js";

export const requireActiveMembership = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.membership) {
      return res.status(403).json({
        message: "No membership found",
      });
    }

    if (user.membership.status !== "Active") {
      return res.status(403).json({
        message: "Active membership required to book classes",
      });
    }

    next();
  } catch (error) {
    console.error("Membership middleware error:", error.message);
    res.status(500).json({ message: "Membership check failed" });
  }
};
