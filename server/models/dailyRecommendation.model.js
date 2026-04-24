import mongoose from "mongoose";

const dailyRecommendationSchema = new mongoose.Schema({
  day: { type: Number, required: true, unique: true },
  contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
  title: String, // Cached title for ease
  note: { type: String, default: "Your morning start." }
}, { timestamps: true });

export default mongoose.model("DailyRecommendation", dailyRecommendationSchema);
