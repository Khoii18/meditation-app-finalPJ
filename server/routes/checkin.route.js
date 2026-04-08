import express from "express";
import { addCheckin } from "../controllers/checkin.controller.js";
import { verifyToken } from "../middleware/auth.js"; // Assuming auth middleware exists

const router = express.Router();

router.post("/", verifyToken, addCheckin);

export default router;
