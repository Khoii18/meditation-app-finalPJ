import express from "express";
import { getTodayJourney } from "../controllers/journey.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/today", verifyToken, getTodayJourney);

export default router;
