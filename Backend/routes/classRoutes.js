  import express from "express";
  import {
    getAllClasses,
    getClassDetails,
    getRecommendedClasses,
    searchClasses
  } from "../controllers/classController.js";
  import { protect } from "../middleware/authMiddle.js";

  const router = express.Router();

  router.get("/", getAllClasses);
  router.get("/search", searchClasses);
  router.get("/recommended", protect, getRecommendedClasses);
  router.get("/:id", getClassDetails);

  export default router;
