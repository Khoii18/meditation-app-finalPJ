import express from "express";
import { getMe, getAllUsers, getUserCheckins, updateUserRole, deleteUser, getMoodAnalytics, getAllCoaches, getCoachById, updateCoachProfile } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin, verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// ─── Public Coach Directory ───────────────────────────────────
router.get("/coaches", getAllCoaches);
router.get("/coaches/:id", getCoachById);

// ─── Current user ─────────────────────────────────────────────
router.get("/me", verifyToken, getMe);
router.put("/me/coach-profile", verifyToken, updateCoachProfile);

// ─── Admin routes ─────────────────────────────────────────────
router.get("/analytics/mood", verifyAdmin, getMoodAnalytics);
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id/checkins", verifyAdmin, getUserCheckins);
router.put("/:id/role", verifyAdmin, updateUserRole);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
