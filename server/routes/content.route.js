import express from "express";
import jwt from "jsonwebtoken";
import Content from "../models/content.model.js";
import User from "../models/user.model.js";
import { verifyAdminOrCoach } from "../middleware/auth.js";

const router = express.Router();

// Helper: get user role from token (returns null if no valid token)
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

// GET content
// - Coach: only their own (createdBy)
// - Admin/Public: all
router.get("/", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (user && user.role === "coach") {
      const contents = await Content.find({ createdBy: user._id });
      return res.json(contents);
    }
    const contents = await Content.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET content by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    res.json(content);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE content (Admin or Coach) — auto-saves createdBy
router.post("/", verifyAdminOrCoach, async (req, res) => {
  try {
    const newContent = await Content.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE content — coach can only update their own
router.put("/:id", verifyAdminOrCoach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json("Content not found");
    if (user.role === "coach" && String(content.createdBy) !== String(user._id)) {
      return res.status(403).json("You can only edit your own content");
    }
    const updated = await Content.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE content — coach can only delete their own
router.delete("/:id", verifyAdminOrCoach, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json("Content not found");
    if (user.role === "coach" && String(content.createdBy) !== String(user._id)) {
      return res.status(403).json("You can only delete your own content");
    }
    await Content.findByIdAndDelete(req.params.id);
    res.json("Content deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
