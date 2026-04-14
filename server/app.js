import 'dotenv/config';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import workoutRoute from "./routes/workout.route.js";
import checkinRoute from "./routes/checkin.route.js";
import coachRoute from "./routes/coach.route.js";
import userRoute from "./routes/user.route.js";
import contentRoute from "./routes/content.route.js";
import liveRoute from "./routes/live.route.js";
import subscriptionRoute from "./routes/subscription.route.js";

const app = express();

// 🔥 BODY PARSER PHẢI ĐẶT TRƯỚC
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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