import 'dotenv/config';

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import workoutRoute from "./routes/workout.route.js";



const app = express();

// 🔥 BODY PARSER PHẢI ĐẶT TRƯỚC
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 DEBUG BODY
app.use((req, res, next) => {
  console.log("BODY:", req.body);
  next();
});

// 🔥 ROUTES
app.use("/api/auth", authRoute);
app.use("/api/workout", workoutRoute);

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