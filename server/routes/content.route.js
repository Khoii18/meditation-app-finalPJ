import express from "express";
import Content from "../models/content.model.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET all content (Public)
router.get("/", async (req, res) => {
  try {
    const contents = await Content.find();
    res.json(contents);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET content by ID
router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    res.json(content);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// CREATE content (Admin only)
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const newContent = await Content.create(req.body);
    res.status(201).json(newContent);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// UPDATE content (Admin only)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedContent);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// DELETE content (Admin only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json("Content deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
