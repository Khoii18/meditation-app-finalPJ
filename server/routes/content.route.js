import express from "express";
import jwt from "jsonwebtoken";
import Content from "../models/content.model.js";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
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

router.get("/seed-coach-content", async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" });
    
    for (const coach of coaches) {
      const diversePlans = [
        {
          name: "Mindfulness Basics",
          price: 9.99,
          currency: "USD",
          period: "month",
          highlighted: true,
          features: ["Guided Breathing", "Daily Reminders", "Community Access"],
          exercises: [
            { title: "Intro to Stillness", duration: "5 min", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
            { title: "Body Scan", duration: "10 min", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
          ]
        },
        {
          name: "Deep Sleep Mastery",
          price: 19.99,
          currency: "USD",
          period: "year",
          highlighted: false,
          features: ["Sleep Stories", "Ambient Sounds", "Expert Coaching"],
          exercises: [
            { title: "Rainy Cabin", duration: "30 min", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
            { title: "Ocean Waves", duration: "45 min", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
            { title: "Theta Waves", duration: "60 min", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
          ]
        }
      ];

      // Update the coach's profile directly
      await User.findByIdAndUpdate(coach._id, {
        "coachProfile.plans": diversePlans
      });

      // Also create Content documents for the player access control
      for (const plan of diversePlans) {
        for (const ex of plan.exercises) {
          await Content.findOneAndUpdate(
            { title: ex.title, createdBy: coach._id },
            {
              ...ex,
              type: "Thiền định",
              instructor: coach.name,
              image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600",
              source: "coach",
              createdBy: coach._id,
              isPremium: true
            },
            { upsert: true }
          );
        }
      }
    }

    res.json({ message: "Coach profiles and content updated with diverse plans!" });
  } catch (err) {
    res.status(500).json(err.message);
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

// GET content by ID (with access control)
router.get("/:id", async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json("Content not found");

    // If it's admin content or coach-created
    if (content.source === "coach") {
      const user = await getUserFromToken(req.headers.authorization);
      if (!user) return res.status(401).json("Please log in to view this coach content");

      // Check access
      const isOwner = String(content.createdBy) === String(user._id);
      const isPremium = user.premiumStatus?.isPremium;
      const sub = await Subscription.findOne({ 
        userId: user._id, 
        coachId: content.createdBy, 
        status: "active" 
      });

      if (!isOwner && !isPremium && !sub) {
        return res.status(403).json({
          error: "Subscription Required",
          message: "This content is exclusive to subscribers of this coach or Premium members.",
          coachId: content.createdBy
        });
      }
    }

    res.json(content);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Helper for bulk content filtering
router.get("/my-library", async (req, res) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);
    if (!user) return res.status(401).json("Unauthorized");

    if (user.premiumStatus?.isPremium) {
      const all = await Content.find();
      return res.json(all);
    }

    const subs = await Subscription.find({ userId: user._id, status: "active" });
    const coachIds = subs.map(s => s.coachId);
    
    const library = await Content.find({
      $or: [
        { source: "admin" },
        { createdBy: user._id },
        { createdBy: { $in: coachIds } }
      ]
    });

    res.json(library);
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
