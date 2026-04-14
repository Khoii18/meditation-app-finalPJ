import express from "express";
import {
  getCoaches, getCoachById,
  subscribe, unsubscribe, getMySubscriptions,
  getMyMemberStats, updateCoachProfile
} from "../controllers/subscription.controller.js";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// Public: list coaches & view coach detail
router.get("/coaches",          getCoaches);
router.get("/coaches/:id",      getCoachById);

// User: manage own subscriptions
router.post("/subscribe",        verifyToken, subscribe);
router.delete("/subscribe/:coachId", verifyToken, unsubscribe);
router.get("/my-subscriptions",  verifyToken, getMySubscriptions);

// Coach: their own member analytics & profile
router.get("/my-members",        verifyAdminOrCoach, getMyMemberStats);
router.put("/my-profile",        verifyAdminOrCoach, updateCoachProfile);

export default router;
