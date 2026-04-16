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
app.use("/api", subscriptionRoute);

// CONNECT DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
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