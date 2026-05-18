import express from "express";
import MembershipPlan from "../model/memberShipPlan.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ isActive: true });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
});

export default router;
