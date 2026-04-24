import express from "express";
import {
  getCoaches, getCoachById,
  subscribe, unsubscribe, getMySubscriptions,
  getMyMemberStats, getMyMembers, updateCoachProfile
} from "../controllers/subscription.controller.js";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";
import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";

const router = express.Router();

// Public: list coaches & view coach detail
router.get("/coaches",          getCoaches);
router.get("/coaches/:id",      getCoachById);

// User: check their subscription status (hasPremium, subscribedCoachIds)
router.get("/status", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    const subs = await Subscription.find({
      userId: req.user.id,
      status: "active"
    });
    
    const subscribedCoachIds = subs.map(s => String(s.coachId));
    
    // hasPremium if they bought a platform package or subscribed to a coach
    const hasPremium = user.premiumStatus?.isPremium || subs.length > 0;
    
    console.log(`[SUBS_STATUS] User: ${user.email}, isPremium: ${user.premiumStatus?.isPremium}, subs: ${subs.length}, hasPremium: ${hasPremium}`);
    
    res.json({ 
      hasPremium, 
      subscribedCoachIds,
      purchasedPackageIds: user.purchasedPackages || []
    });
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
router.get("/my-members/list",   verifyAdminOrCoach, getMyMembers);
router.put("/my-profile",        verifyAdminOrCoach, updateCoachProfile);

export default router;
