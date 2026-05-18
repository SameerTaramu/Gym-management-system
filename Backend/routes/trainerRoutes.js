import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddle.js";
import {
  getTrainerBookings,
} from "../controllers/trainerController.js";

const router = express.Router();

router.get(
  "/bookings",
  protect,
  authorizeRoles("trainer"),
  getTrainerBookings
);

export default router;
