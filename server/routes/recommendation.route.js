import express from "express";
import { getRecommendations, updateRecommendation, deleteRecommendation } from "../controllers/recommendation.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRecommendations);
router.post("/", verifyToken, verifyAdmin, updateRecommendation);
router.delete("/:id", verifyToken, verifyAdmin, deleteRecommendation);

export default router;
