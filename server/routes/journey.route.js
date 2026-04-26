import express from "express";
import { getTodayJourney, completeSession } from "../controllers/journey.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/today", verifyToken, getTodayJourney);
router.post("/complete", verifyToken, completeSession);

export default router;
