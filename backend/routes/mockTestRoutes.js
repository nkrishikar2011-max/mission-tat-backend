// backend/routes/mockTestRoutes.js
// (Taddan navi file - Chaloo service ne safe rakhva mate)

import express from "express";
import { 
  createMockTest, 
  getAllMockTests, 
  getMockTestById, 
  submitTestAttempt, 
  getUserHistory 
} from "../controllers/mockTestController.js";

const router = express.Router();

router.post("/create", createMockTest);
router.get("/all", getAllMockTests);
router.get("/:id", getMockTestById);
router.post("/submit", submitTestAttempt);
router.get("/user-history/:userId", getUserHistory);

export default router;