import express from "express";
import { verifyAttendance } from "../controllers/attendanceController.js";
import { protect, authorizeRoles } from "../middleware/authMiddle.js";
const router = express.Router();

router.post("/verify", protect, authorizeRoles("trainer"), verifyAttendance);
export default router;