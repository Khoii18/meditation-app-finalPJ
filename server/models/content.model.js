import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  instructor: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "Thiền định", "Thư giãn", "Story", "Sound"
  description: { type: String },
  audioUrl: { type: String },
  subject: { type: String, default: "" },
  bgGradient: { type: String, default: "" },
  iconColor: { type: String, default: "" },
  iconName: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // coach/admin who created this
  // Access control fields
  isPremium: { type: Boolean, default: false },  // false = free, true = requires subscription
  unlockedByStreak: { type: String, default: null }, // e.g. "streak-1", "streak-3"
  source: { type: String, enum: ["admin", "coach"], default: "admin" }, // who owns this content
  // Lessons for plans
  lessons: [{
    title: { type: String },
    description: { type: String },
    suggestion: { type: String },
    type: { type: String, enum: ["Thiền định", "Hơi thở", "Thư giãn", "Ngủ"], default: "Thiền định" },
    audioUrl: { type: String },
    duration: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);
