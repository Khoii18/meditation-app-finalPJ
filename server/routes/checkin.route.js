import express from "express";
import { addCheckin, updateMood } from "../controllers/checkin.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addCheckin);
router.post("/mood", verifyToken, updateMood); // Update mood for today's checkin

export default router;
