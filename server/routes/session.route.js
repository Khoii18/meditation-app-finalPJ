import express from "express";
import { verifyToken, verifyAdminOrCoach } from "../middleware/auth.js";
import {
  startOrUpdateSession,
  getUserNotifications,
  getAdminSessionStats,
  getIncompleteReminders,
} from "../controllers/session.controller.js";

const router = express.Router();

router.post("/progress", verifyToken, startOrUpdateSession);
router.get("/notifications", verifyToken, getUserNotifications);
router.get("/reminders", verifyToken, getIncompleteReminders);
router.get("/admin/stats", verifyAdminOrCoach, getAdminSessionStats);

export default router;
