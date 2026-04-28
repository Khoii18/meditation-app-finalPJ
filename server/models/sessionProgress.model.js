import mongoose from "mongoose";

const sessionProgressSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contentId:   { type: String, required: true },
  contentTitle:{ type: String, default: "" },
  totalDuration: { type: Number, default: 0 },
  watchedDuration: { type: Number, default: 0 },
  completed:   { type: Boolean, default: false },
  notified:    { type: Boolean, default: false },
  startedAt:   { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  lastActiveAt:{ type: Date, default: Date.now },
}, { timestamps: true });

sessionProgressSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model("SessionProgress", sessionProgressSchema);
