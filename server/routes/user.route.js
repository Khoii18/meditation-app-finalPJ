import express from "express";
import { getMe, getAllUsers, getUserCheckins, updateUserRole, deleteUser, getMoodAnalytics, getAllCoaches, getCoachById, updateCoachProfile, updateAccountSettings, updateUserSettings, claimReward, onboardUser, updateUserPremium } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin, verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// ─── Public Coach Directory ───────────────────────────────────
router.get("/coaches", getAllCoaches);
router.get("/coaches/:id", getCoachById);

// ─── Current user ─────────────────────────────────────────────
router.get("/me", verifyToken, getMe);
router.post("/me/onboard", verifyToken, onboardUser);
router.post("/me/claim-reward", verifyToken, claimReward);
router.put("/me/coach-profile", verifyToken, updateCoachProfile);
router.put("/me/settings", verifyToken, updateAccountSettings);
router.put("/me/settings-ui", verifyToken, updateUserSettings);

// ─── Admin routes ─────────────────────────────────────────────
router.get("/analytics/mood", verifyAdmin, getMoodAnalytics);
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id/checkins", verifyAdmin, getUserCheckins);
router.put("/:id/role", verifyAdmin, updateUserRole);
router.put("/:id/premium", verifyAdmin, updateUserPremium);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
