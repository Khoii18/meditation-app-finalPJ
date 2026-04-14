import express from "express";
import { getMe, getAllUsers, getUserCheckins, updateUserRole, deleteUser, getMoodAnalytics } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Current user
router.get("/me", verifyToken, getMe);

// Admin routes
router.get("/analytics/mood", verifyAdmin, getMoodAnalytics);
router.get("/", verifyAdmin, getAllUsers);
router.get("/:id/checkins", verifyAdmin, getUserCheckins);
router.put("/:id/role", verifyAdmin, updateUserRole);
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
