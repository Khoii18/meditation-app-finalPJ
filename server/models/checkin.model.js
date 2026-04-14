import mongoose from "mongoose";

const checkinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sleep: String,
  energy: String,
  goal: String,
  mood: { type: String, default: null }, // emoji label: Angry, Sad, Neutral, Peaceful, Happy
  moodNote: { type: String, default: null }, // optional note
  date: { type: String, required: true }, // Format YYYY-MM-DD
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Checkin", checkinSchema);
