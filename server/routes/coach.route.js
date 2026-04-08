import express from "express";
import { createPlan } from "../controllers/coach.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/plan", verifyToken, createPlan);

export default router;
