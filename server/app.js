import 'dotenv/config';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import authRoute from "./routes/auth.route.js";
import workoutRoute from "./routes/workout.route.js";
import checkinRoute from "./routes/checkin.route.js";
import coachRoute from "./routes/coach.route.js";
import userRoute from "./routes/user.route.js";
import contentRoute from "./routes/content.route.js";
import liveRoute from "./routes/live.route.js";
import subscriptionRoute from "./routes/subscription.route.js";
import journeyRoute from "./routes/journey.route.js";
import aiRoute from "./routes/ai.route.js";
import paymentRoute from "./routes/payment.route.js";
import { generateSignature } from "./controllers/Cloudinary.controller.js";

const app = express();

// 🔥 BODY PARSER PHẢI ĐẶT TRƯỚC
app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/cloudinary-signature", generateSignature);

app.post("/api/upload", (req, res) => {
  try {
    const fileName = req.query.fileName || "upload.mp4";
    const uploadsDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    
    const uniqueName = Date.now() + "-" + fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    const destPath = path.join(uploadsDir, uniqueName);
    const writeStream = fs.createWriteStream(destPath);
    
    req.pipe(writeStream);
    
    req.on('end', () => {
      res.json({ url: `http://localhost:5000/uploads/${uniqueName}` });
    });

    req.on('error', (err) => {
      console.error("Stream error:", err);
      res.status(500).json(err.message);
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// removed debug block

// 🔥 ROUTES
app.use("/api/auth", authRoute);
app.use("/api/workout", workoutRoute);
app.use("/api/checkins", checkinRoute);
app.use("/api/coach", coachRoute);
app.use("/api/users", userRoute);
app.use("/api/content", contentRoute);
app.use("/api/live", liveRoute);
app.use("/api/journey", journeyRoute);
app.use("/api/ai-coach", aiRoute);
app.use("/api/payment", paymentRoute);
import Content from "./models/content.model.js";

const PLAN_CATEGORIES = [{title:"Morning Meditations",items:[{title:"Wake Up",duration:"Single • 3 min",iconName:"Sunrise",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-sky-400"},{title:"Morning Brew",duration:"Single • 5 min",iconName:"Coffee",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-indigo-400"},{title:"Gratitude",duration:"Single • 5 min",iconName:"Heart",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-400"}]},{title:"Release Tension",items:[{title:"Sound Scan",duration:"Single • 5 min",iconName:"Mic",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-400"},{title:"Frustration",duration:"Single • 10 min",iconName:"CloudLightning",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"},{title:"Body Scan",duration:"Single • 5 min",iconName:"Activity",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-400"}]},{title:"For Later",items:[{title:"Immersive Forest",duration:"Sleep Single • 10 min",iconName:"Leaf",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-500"},{title:"Dream Scenes",duration:"Sleep Single • 20 min",iconName:"CloudMoon",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-300"},{title:"Rain",duration:"Sleep Sound",iconName:"CloudRain",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-blue-400"}]},{title:"Get Support",items:[{title:"Confidence",duration:"Single • 10 min",iconName:"SunMedium",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-300"},{title:"Ease Loneliness",duration:"Single • 10 min",iconName:"UserCheck",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-orange-300"},{title:"Facing Fear",duration:"Single • 15 min",iconName:"CheckCircle",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-violet-400"},{title:"Pain",duration:"Single • 10 min",iconName:"HelpCircle",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"},{title:"Parent",duration:"Plan • 5 Days",iconName:"Home",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-500"}]},{title:"Lift Your Mood",items:[{title:"Happiness",duration:"Single • 10 min",iconName:"Smile",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-300"},{title:"Embrace Change",duration:"Single • 10 min",iconName:"RotateCcw",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-400"},{title:"Energy",duration:"Single • 10 min",iconName:"Zap",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-400"}]},{title:"Learn to Meditate",items:[{title:"Foundations",duration:"Plan • 10 Days",iconName:"Monitor",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-violet-500"},{title:"Foundations II",duration:"Plan • 10 Days",iconName:"Layers",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-teal-400"},{title:"Foundations V",duration:"Plan • 10 Days",iconName:"Map",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-rose-400"}]},{title:"Advance Your Practice",items:[{title:"Advanced",duration:"Plan • 10 Days",iconName:"Target",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-amber-500"},{title:"Advanced II",duration:"Plan • 10 Days",iconName:"AlignStartVertical",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-emerald-500"},{title:"Advanced III",duration:"Plan • 10 Days",iconName:"TrendingUp",bgGradient:"from-slate-700 to-slate-800",iconColor:"text-sky-400"}]}];

// CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    const existing = await Content.countDocuments({ type: "plan" });
    if (existing === 0) {
      console.log("Seeding plans automatically on boot...");
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
    }
  })
  .catch(err => console.log(err));

console.log(process.env.MONGO_URI);

// test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});