import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coachId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planName: { type: String, required: true }, // "Basic" | "Pro" | "Premium"
  status:   { type: String, enum: ["active", "cancelled"], default: "active" },
  startDate: { type: Date, default: Date.now },
  endDate:   { type: Date } // optional expiry
}, { timestamps: true });

// One active subscription per user per coach
subscriptionSchema.index({ userId: 1, coachId: 1 }, { unique: true });

export default mongoose.model("Subscription", subscriptionSchema);
