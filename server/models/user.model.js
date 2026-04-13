import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,

  stats: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
    mindfulMinutes: { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: null } // ISO String (YYYY-MM-DD)
  },
  
  role: { type: String, enum: ["user", "admin", "coach"], default: "user" } // 'user', 'admin', or 'coach'
});

export default mongoose.model("User", userSchema);