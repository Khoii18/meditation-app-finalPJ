import express from "express";
import { generateAiPlan } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", verifyToken, generateAiPlan);

export default router;
