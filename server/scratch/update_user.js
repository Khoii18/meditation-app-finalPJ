import mongoose from "mongoose";
import 'dotenv/config';
import User from "../models/user.model.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    const user = await User.findOne({ email: "cuong@gmail.com" });
    if (user) {
      user.stats = {
        currentStreak: 30,
        longestStreak: 30,
        totalSessions: 50,
        mindfulMinutes: 450,
        lastCheckInDate: new Date().toISOString().split('T')[0]
      };
      user.premiumStatus = {
        isPremium: true,
        planType: "lifetime",
        startDate: new Date(),
        expiryDate: new Date(Date.now() + 365*100*24*60*60*1000)
      };
      await user.save();
      console.log("Updated cuong@gmail.com successfully");
    } else {
      console.log("User cuong@gmail.com not found");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
