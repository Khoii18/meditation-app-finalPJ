import express from "express";
import { createWorkout } from "../controllers/workout.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, createWorkout);

export default router;