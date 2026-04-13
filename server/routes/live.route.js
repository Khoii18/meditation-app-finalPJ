import express from "express";
import jwt from "jsonwebtoken";
import Live from "../models/live.model.js";
import User from "../models/user.model.js";
import { verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// Helper: get user from token (returns null if no valid token)
const getUserFromToken = async (authHeader) => {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch (_) {
    return null;
  }
};

// GET live sessions
// - Coach: only their own
// - Admin/Public: all
router.get("/", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (user && user.role === "coach") {
      const lives = await Live.find({ createdBy: user._id });
      return res.json(lives);
    }
    const lives = await Live.find();
    res.json(lives);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE live session (Admin or Coach) — auto-saves createdBy
router.post("/", verifyAdminOrCoach, async (req, res) => {
  try {
    const newLive = await Live.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(newLive);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE live session — coach can only update their own
router.put("/:id", verifyAdminOrCoach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const live = await Live.findById(req.params.id);
    if (!live) return res.status(404).json("Live session not found");
    if (user.role === "coach" && String(live.createdBy) !== String(user._id)) {
      return res.status(403).json("You can only edit your own live session");
    }
    const updated = await Live.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE live session — coach can only delete their own
router.delete("/:id", verifyAdminOrCoach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const live = await Live.findById(req.params.id);
    if (!live) return res.status(404).json("Live session not found");
    if (user.role === "coach" && String(live.createdBy) !== String(user._id)) {
      return res.status(403).json("You can only delete your own live session");
    }
    await Live.findByIdAndDelete(req.params.id);
    res.json("Live session deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
