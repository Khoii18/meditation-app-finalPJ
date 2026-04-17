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

const PLAN_CATEGORIES=[{title:"Morning Meditations",items:[{title:"Wake Up",duration:"Single • 3 min",iconName:"Sunrise",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-sky-400"},{title:"Morning Brew",duration:"Single • 5 min",iconName:"Coffee",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-indigo-400"},{title:"Gratitude",duration:"Single • 5 min",iconName:"Heart",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-400"}]},{title:"Release Tension",items:[{title:"Sound Scan",duration:"Single • 5 min",iconName:"Mic",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-400"},{title:"Frustration",duration:"Single • 10 min",iconName:"CloudLightning",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"},{title:"Body Scan",duration:"Single • 5 min",iconName:"Activity",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-400"}]},{title:"For Later",items:[{title:"Immersive Forest",duration:"Sleep Single • 10 min",iconName:"Leaf",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-500"},{title:"Dream Scenes",duration:"Sleep Single • 20 min",iconName:"CloudMoon",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-300"},{title:"Rain",duration:"Sleep Sound",iconName:"CloudRain",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-blue-400"}]},{title:"Get Support",items:[{title:"Confidence",duration:"Single • 10 min",iconName:"SunMedium",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-300"},{title:"Ease Loneliness",duration:"Single • 10 min",iconName:"UserCheck",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-orange-300"},{title:"Facing Fear",duration:"Single • 15 min",iconName:"CheckCircle",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-violet-400"},{title:"Pain",duration:"Single • 10 min",iconName:"HelpCircle",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"},{title:"Parent",duration:"Plan • 5 Days",iconName:"Home",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-500"}]},{title:"Lift Your Mood",items:[{title:"Happiness",duration:"Single • 10 min",iconName:"Smile",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-300"},{title:"Embrace Change",duration:"Single • 10 min",iconName:"RotateCcw",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-400"},{title:"Energy",duration:"Single • 10 min",iconName:"Zap",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-400"}]},{title:"Learn to Meditate",items:[{title:"Foundations",duration:"Plan • 10 Days",iconName:"Monitor",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-violet-500"},{title:"Foundations II",duration:"Plan • 10 Days",iconName:"Layers",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-400"},{title:"Foundations V",duration:"Plan • 10 Days",iconName:"Map",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"}]},{title:"Advance Your Practice",items:[{title:"Advanced",duration:"Plan • 10 Days",iconName:"Target",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-500"},{title:"Advanced II",duration:"Plan • 10 Days",iconName:"AlignStartVertical",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-500"},{title:"Advanced III",duration:"Plan • 10 Days",iconName:"TrendingUp",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-sky-400"}]}];

router.get("/seed-plans", async (req, res) => {
  try {
    const existing = await Content.countDocuments({ type: "plan" });
    if (existing === 0) {
      for (const category of PLAN_CATEGORIES) {
        for (const item of category.items) {
          await Content.create({
            title: item.title,
            type: "plan",
            duration: item.duration,
            instructor: "Oasis Coach",
            image: "https://via.placeholder.com/600x600/0A0A0C/FFFFFF/?text=" + item.title.replace(/ /g, '+'),
            subject: category.title,
            iconName: item.iconName,
            bgGradient: item.bgGradient,
            iconColor: item.iconColor,
            audioUrl: ""
          });
        }
      }
      return res.json("Seeded successfully");
    }
    res.json("Already seeded");
  } catch(err) {
    res.json({ error: err.message, stack: err.stack });
  }
});

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
