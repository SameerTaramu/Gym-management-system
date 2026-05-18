import express from "express";
import {
  getAvailableTrainers,
  hireTrainer,
  getMyHiredTrainers,
  getTrainerClients,
  cancelTrainerHire,
} from "../controllers/trainerHireController.js";
import { protect } from "../middleware/authMiddle.js";

const router = express.Router();

router.get("/trainers", protect, getAvailableTrainers);
router.post("/hire", protect, hireTrainer);
router.get("/my-hires", protect, getMyHiredTrainers);
router.get("/clients", protect, getTrainerClients);
router.put("/cancel/:id", protect, cancelTrainerHire);

export default router;