import express from "express";
import { checkMembershipExpiry } from "../middleware/checkExpiry.js";
import { protect } from "../middleware/authMiddle.js";
import {
  buyMembershipCash,
  renewMembership,
  cancelMembership,
  getMembership,
} from "../controllers/membershipController.js";

import {
  buyMembershipEsewa,
  esewaSuccessMembership,
  esewaCancelMembership,
  renewMembershipEsewa,
  buyMembershipKhalti,
  renewMembershipKhalti,
  khaltiSuccessMembership,
  khaltiCancelMembership,
} from "../controllers/paymentController.js";

const router = express.Router();
router.post("/esewa", protect,  buyMembershipEsewa);
router.post("/esewa/renew", protect,  renewMembershipEsewa);
router.get("/esewa/success", esewaSuccessMembership);
router.get("/esewa/failure", esewaCancelMembership);
router.post("/khalti", protect, buyMembershipKhalti);
router.post("/khalti/renew", protect, renewMembershipKhalti);
router.get("/khalti/success", khaltiSuccessMembership);
router.get("/khalti/failure", khaltiCancelMembership);
router.use(protect, checkMembershipExpiry);
router.post("/cash", protect, buyMembershipCash);
router.post("/renew", protect, renewMembership);
router.delete("/cancel", protect, cancelMembership);


router.get("/", protect, getMembership);

export default router;
