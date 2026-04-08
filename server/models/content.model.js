import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  instructor: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true }, // e.g. "Thiền định", "Thư giãn", "Story", "Sound"
  description: { type: String },
  audioUrl: { type: String }
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);
