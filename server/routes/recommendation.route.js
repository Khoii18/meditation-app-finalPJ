import express from "express";
import { getRecommendations, updateRecommendation, deleteRecommendation } from "../controllers/recommendation.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getRecommendations);
router.post("/", verifyToken, isAdmin, updateRecommendation);
router.delete("/:id", verifyToken, isAdmin, deleteRecommendation);

export default router;
