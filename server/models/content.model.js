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
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // coach/admin who created this
}, { timestamps: true });

export default mongoose.model("Content", contentSchema);
