import express from "express";
import {
  getMyBookings,
  bookClass,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddle.js";
import { requireActiveMembership } from "../middleware/membershipMiddleware.js";

const router = express.Router();
router.get("/my", protect, getMyBookings);

router.post("/book", protect, requireActiveMembership, bookClass);

router.put("/cancel/:bookingId", protect, cancelBooking);

export default router;
