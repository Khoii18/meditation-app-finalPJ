import express from "express";
import { generateAiPlan, chatWithLunaria } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", verifyToken, generateAiPlan);
router.post("/chat", verifyToken, chatWithLunaria);

export default router;
