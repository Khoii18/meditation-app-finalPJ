import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,

  stats: {
    currentStreak:   { type: Number, default: 0 },
    longestStreak:   { type: Number, default: 0 },
    totalSessions:   { type: Number, default: 0 },
    mindfulMinutes:  { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: null }
  },

  role: { type: String, enum: ["user", "admin", "coach"], default: "user" },

  // Coach-only profile fields
  coachProfile: {
    bio:         { type: String, default: "" },
    specialties: { type: [String], default: [] },
    avatar:      { type: String, default: "" },
    plans: {
      type: [{
        name:        String,
        price:       Number,
        currency:    { type: String, default: "USD" },
        period:      { type: String, default: "month" },
        features:    [String],
        highlighted: { type: Boolean, default: false }
      }],
      default: []
    }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);