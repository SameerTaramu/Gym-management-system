import User from "../model/userModel.js";
import { calculateMembershipEndDate } from "../utils/membershipDates.js";
export const getPendingMemberships = async (req, res) => {
  try {
    const users = await User.find({
      "membership.status": "Pending",
      "membership.paymentMethod": "Cash",
    }).populate("membership.plan", "name duration price");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending memberships" });
  }
};

export const approveMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate("membership.plan");

    if (!user || !user.membership)
      return res.status(404).json({ message: "Membership not found" });

    if (user.membership.status !== "Pending")
      return res.status(400).json({ message: "Membership is not pending" });

    if (user.membership.paymentMethod !== "Cash")
      return res.status(400).json({
        message: "Only cash memberships require admin approval",
      });

    const now = new Date();
    const endDate = calculateMembershipEndDate(
      now,
      user.membership.plan.duration
    );

    user.membership.status = "Active";
    user.membership.startDate = now;
    user.membership.endDate = endDate;
    user.membership.paymentVerified = true;
    user.membership.approvedAt = now;

    await user.save();

    res.json({ message: "Membership approved & activated" });
  } catch (error) {
    res.status(500).json({ message: "Approval failed" });
  }
};



export const rejectMembership = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.membership)
      return res.status(404).json({ message: "Membership not found" });

    if (user.membership.status !== "Pending")
      return res.status(400).json({
        message: "Only pending memberships can be rejected",
      });

    user.membership.status = "Rejected";
    user.membership.rejectedAt = new Date();
    user.membership.startDate = undefined;
    user.membership.endDate = undefined;
    user.membership.paymentVerified = false;

    await user.save();

    res.json({ message: "Membership rejected" });
  } catch (error) {
    res.status(500).json({ message: "Reject failed" });
  }
};

