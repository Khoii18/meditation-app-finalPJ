import mongoose from "mongoose";
import dotenv from "dotenv";
import Content from "../models/content.model.js";

dotenv.config();

const PLAN_CATEGORIES = [
  {
    title: "Morning Meditations",
    items: [
      { title: "Wake Up", duration: "Single • 3 min", iconName: "Sunrise", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-sky-400" },
      { title: "Morning Brew", duration: "Single • 5 min", iconName: "Coffee", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-indigo-400" },
      { title: "Gratitude", duration: "Single • 5 min", iconName: "Heart", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-emerald-400" },
    ]
  },
  {
    title: "Release Tension",
    items: [
      { title: "Sound Scan", duration: "Single • 5 min", iconName: "Mic", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-amber-400" },
      { title: "Frustration", duration: "Single • 10 min", iconName: "CloudLightning", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
      { title: "Body Scan", duration: "Single • 5 min", iconName: "Activity", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-teal-400" },
    ]
  },
  {
    title: "For Later",
    items: [
      { title: "Immersive Forest", duration: "Sleep Single • 10 min", iconName: "Leaf", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-emerald-500" },
      { title: "Dream Scenes", duration: "Sleep Single • 20 min", iconName: "CloudMoon", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-rose-300" },
      { title: "Rain", duration: "Sleep Sound", iconName: "CloudRain", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-blue-400" },
    ]
  },
  {
    title: "Get Support",
    items: [
      { title: "Confidence", duration: "Single • 10 min", iconName: "SunMedium", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-amber-300" },
      { title: "Ease Loneliness", duration: "Single • 10 min", iconName: "UserCheck", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-orange-300" },
      { title: "Facing Fear", duration: "Single • 15 min", iconName: "CheckCircle", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-violet-400" },
      { title: "Pain", duration: "Single • 10 min", iconName: "HelpCircle", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
      { title: "Parent", duration: "Plan • 5 Days", iconName: "Home", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-teal-500" },
    ]
  },
  {
    title: "Lift Your Mood",
    items: [
      { title: "Happiness", duration: "Single • 10 min", iconName: "Smile", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-rose-300" },
      { title: "Embrace Change", duration: "Single • 10 min", iconName: "RotateCcw", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-emerald-400" },
      { title: "Energy", duration: "Single • 10 min", iconName: "Zap", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-amber-400" },
    ]
  },
  {
    title: "Learn to Meditate",
    items: [
      { title: "Foundations", duration: "Plan • 10 Days", iconName: "Monitor", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-violet-500" },
      { title: "Foundations II", duration: "Plan • 10 Days", iconName: "Layers", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-teal-400" },
      { title: "Foundations V", duration: "Plan • 10 Days", iconName: "Map", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-rose-400" },
    ]
  },
  {
    title: "Advance Your Practice",
    items: [
      { title: "Advanced", duration: "Plan • 10 Days", iconName: "Target", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-amber-500" },
      { title: "Advanced II", duration: "Plan • 10 Days", iconName: "AlignStartVertical", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-emerald-500" },
      { title: "Advanced III", duration: "Plan • 10 Days", iconName: "TrendingUp", bgGradient: "from-slate-700 to-slate-800", iconColor: "text-sky-400" },
    ]
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB for Seeding Plans");

    // Optional: Delete previous auto-seeded plans to avoid duplicates
    await Content.deleteMany({ type: "plan" });

    for (const category of PLAN_CATEGORIES) {
      for (const item of category.items) {
        await Content.create({
          title: item.title,
          type: "plan",
          duration: item.duration,
          instructor: "Oasis Content", // generic
          image: "https://via.placeholder.com/600x600/0A0A0C/FFFFFF/?text=" + item.title, // placeholder
          subject: category.title,
          iconName: item.iconName,
          bgGradient: item.bgGradient,
          iconColor: item.iconColor,
          audioUrl: ""
        });
      }
    }

    console.log("Successfully seeded plans!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
