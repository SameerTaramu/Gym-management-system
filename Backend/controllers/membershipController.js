import User from "../model/userModel.js";
import MembershipPlan from "../model/memberShipPlan.js";
export const buyMembershipCash = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = await MembershipPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = await User.findById(req.user._id);

if (user.membership?.status && user.membership.status !== "Expired"){
        return res.status(400).json({
        message: "You already have an active or pending membership",
      });
    }

    user.membership = {
      plan: plan._id,
      status: "Pending",
      paymentMethod: "Cash",
      purchasedAt: new Date(),
      paymentVerified: false,
      startDate: undefined,
      endDate: undefined,
    };

    await user.save();

    res.status(200).json({
      message: "Membership purchased (Pending admin approval)",
      membership: user.membership,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to buy membership" });
  }
};

export const renewMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("membership.plan");

    if (!user || !user.membership)
      return res.status(404).json({ message: "No membership found" });

    if (user.membership.status !== "Expired")
      return res.status(400).json({ message: "Only expired memberships can be renewed" });

    user.membership.status = "Pending";
    user.membership.paymentMethod = "Cash";
    user.membership.paymentVerified = false;
    user.membership.purchasedAt = new Date();
    user.membership.startDate = undefined;
    user.membership.endDate = undefined;

    await user.save();

    res.json({
      message: "Membership renewal requested (Cash, pending approval)",
      membership: user.membership,
    });
  } catch (error) {
    console.error("Renew membership error:", error);
    res.status(500).json({ message: "Renewal failed" });
  }
};


export const cancelMembership = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user.membership || user.membership.status !== "Pending") {
            return res.status(400).json({ message: "No pending membership" });
        }

        user.membership = undefined;
        await user.save();

        res.json({ message: "Pending membership cancelled" });
    } catch (error) {
        res.status(500).json({ message: "Cancel failed" });
    }
};
export const getMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "membership.plan",
      "name duration price canHireTrainer"
    );

    res.json({ membership: user.membership || null });
  } catch (error) {
    console.error("Get membership error:", error);
    res.status(500).json({ message: "Failed to fetch membership" });
  }
};