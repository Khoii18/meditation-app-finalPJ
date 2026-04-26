import express from "express";
import { addReview, getCoachReviews } from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, addReview);
router.get("/coach/:id", getCoachReviews);

export default router;
