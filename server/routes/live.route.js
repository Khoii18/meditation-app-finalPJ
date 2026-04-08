import express from "express";
import Live from "../models/live.model.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all live sessions (Public)
router.get("/", async (req, res) => {
  try {
    const lives = await Live.find();
    res.json(lives);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE live session (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newLive = await Live.create(req.body);
    res.status(201).json(newLive);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE live session (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedLive = await Live.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedLive);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE live session (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Live.findByIdAndDelete(req.params.id);
    res.json("Live session deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
