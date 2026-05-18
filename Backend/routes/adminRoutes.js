import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddle.js";
import {
  getAllUsers,
  deleteUser,
  createTrainer,
  toggleTrainerStatus,
  getAllTrainers,
  createMembershipPlan,
  deleteMembershipPlan,
  getAllMembershipPlans,
  getActiveMemberships,
  createClass,
  updateClass,
  deleteClass,
  getAllClassesAdmin,
  getClassDetailsAdmin,
  deactivateMembership,
  reopenClass,
} from "../controllers/adminController.js";
import { getPendingMemberships, approveMembership, rejectMembership } from "../controllers/adminMemController.js";
import { upload } from "../middleware/upload.js";
import { deleteBookingAdmin, getAllBookings, getBookingDetails } from "../controllers/adminBookController.js";
import { getAdminStats } from "../controllers/adminStatsController.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/user/:id", protect, authorizeRoles("admin"), deleteUser);
router.post(
  "/memberships",
  protect,
  authorizeRoles("admin"),
  createMembershipPlan
);

router.delete("/memberships/:id",protect,  authorizeRoles("admin"), deleteMembershipPlan);
router.get("/memberships", protect, authorizeRoles("admin"), getAllMembershipPlans);
router.get(
  "/memberships/active",
  protect,
  authorizeRoles("admin"),
  getActiveMemberships
);
router.put("/memberships/deactivate/:id", protect, authorizeRoles("admin"), deactivateMembership);
router.post("/classes", protect, authorizeRoles("admin"), upload.single("image"), createClass);
router.put("/classes/:id", protect, authorizeRoles("admin"), upload.single("image"), updateClass);
router.delete("/classes/:id", protect, authorizeRoles("admin"), deleteClass);
router.get("/classes", protect, authorizeRoles("admin"), getAllClassesAdmin);
router.get("/classes/:id", protect, authorizeRoles("admin"), getClassDetailsAdmin);
router.put(
  "/classes/reopen/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  reopenClass
);

router.get("/memberships/pending", protect, authorizeRoles("admin"), getPendingMemberships);
router.put("/memberships/approve/:userId", protect, authorizeRoles("admin"), approveMembership);
router.delete("/memberships/reject/:userId", protect, authorizeRoles("admin"), rejectMembership);
router.get("/bookings",protect,authorizeRoles("admin"),getAllBookings);
router.get("/bookings/:id",protect,authorizeRoles("admin"),getBookingDetails);
router.delete("/bookings/:id",protect,authorizeRoles("admin"), deleteBookingAdmin);
router.post("/trainers", protect, authorizeRoles("admin"), upload.single("image"), createTrainer);
router.get(
  "/trainers",
  protect,
  authorizeRoles("admin"),
  getAllTrainers
);
router.put(
  "/trainers/:id/status",
  protect,
  authorizeRoles("admin"),
  toggleTrainerStatus
);
router.get("/stats",protect,authorizeRoles("admin"),getAdminStats);

export default router;
