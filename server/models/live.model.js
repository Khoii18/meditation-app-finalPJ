import mongoose from "mongoose";

const liveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true },
  instructor: { type: String, required: true },
  image: { type: String, required: true },
  isLive: { type: Boolean, default: false },
  participants: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Live", liveSchema);
