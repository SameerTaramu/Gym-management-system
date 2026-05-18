import User from "../model/userModel.js";

export const checkMembershipExpiry = async (req, res, next) => {
  try {
    if (!req.user) return next();

    const user = await User.findById(req.user._id);

    if (
      user?.membership?.status === "Active" &&
      user.membership.endDate &&
      new Date() > new Date(user.membership.endDate)
    ) {
      user.membership.status = "Expired";
      await user.save();
    }

    next();
  } catch (error) {
    console.error("Membership expiry middleware error:", error);
    next(); 
  }
};
