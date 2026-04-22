import express from "express";
import {
  getCoaches, getCoachById,
  subscribe, unsubscribe, getMySubscriptions,
  getMyMemberStats, updateCoachProfile
} from "../controllers/subscription.controller.js";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";
import Subscription from "../models/subscription.model.js";

const router = express.Router();

// Public: list coaches & view coach detail
router.get("/coaches",          getCoaches);
router.get("/coaches/:id",      getCoachById);

// User: check their subscription status (hasPremium, subscribedCoachIds)
router.get("/status", verifyToken, async (req, res) => {
  try {
    const subs = await Subscription.find({
      userId: req.user.id,
      status: "active"
    });
    const subscribedCoachIds = subs.map(s => String(s.coachId));
    res.json({ hasPremium: subs.length > 0, subscribedCoachIds });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// User: manage own subscriptions
router.post("/subscribe",        verifyToken, subscribe);
router.delete("/subscribe/:coachId", verifyToken, unsubscribe);
router.get("/my-subscriptions",  verifyToken, getMySubscriptions);

// Coach: their own member analytics & profile
router.get("/my-members",        verifyAdminOrCoach, getMyMemberStats);
router.put("/my-profile",        verifyAdminOrCoach, updateCoachProfile);

export default router;
