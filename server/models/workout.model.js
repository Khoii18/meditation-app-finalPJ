import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  plan: Object,
  exercises: Array,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Workout", workoutSchema);