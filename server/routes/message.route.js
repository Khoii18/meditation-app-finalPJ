import express from "express";
import { sendMessage, getMessages, replyMessage, getAdminMessages } from "../controllers/message.controller.js";
import { verifyToken, verifyAdminOrCoach, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/", verifyToken, getMessages);
router.post("/reply", verifyAdminOrCoach, replyMessage);
router.get("/admin", verifyAdmin, getAdminMessages);

export default router;
