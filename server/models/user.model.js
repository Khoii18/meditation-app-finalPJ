import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
  avatar: { type: String, default: "" },

  stats: {
    currentStreak:   { type: Number, default: 0 },
    longestStreak:   { type: Number, default: 0 },
    totalSessions:   { type: Number, default: 0 },
    mindfulMinutes:  { type: Number, default: 0 },
    lastCheckInDate: { type: String, default: null }
  },

  // Balance App Logic
  activePlan: { type: mongoose.Schema.Types.ObjectId, ref: "Content", default: null },
  planProgress: { type: Number, default: 0 },
  skills: {
    focus: { type: Number, default: 0 },
    relaxation: { type: Number, default: 0 },
    breathControl: { type: Number, default: 0 },
    awareness: { type: Number, default: 0 }
  },
  onboardingAnswers: {
    goals: [String],
    experience: String
  },

  role: { type: String, enum: ["user", "admin", "coach"], default: "user" },

  // Subscription management
  premiumStatus: {
    isPremium: { type: Boolean, default: false },
    planType: { type: String, enum: ["none", "monthly", "annual", "lifetime"], default: "none" },
    startDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null }
  },

  // Coach-only profile fields
  coachProfile: {
    bio:         { type: String, default: "" },
    specialties: { type: [String], default: [] },
    avatar:      { type: String, default: "" },
    introVideo:  { type: String, default: "" },
    plans: {
      type: [{
        name:        String,
        price:       Number,
        currency:    { type: String, default: "USD" },
        period:      { type: String, default: "month" },
        features:    [String],
        exercises:   [{
          title:     String,
          duration:  String,
          audioUrl:  String,
        }],
        highlighted: { type: Boolean, default: false }
      }],
      default: []
    }
  },
  claimedRewards: { type: [String], default: [] },
  settings: {
    notifications: {
      dailyReminders: { type: Boolean, default: true },
      newContent: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true },
      communityActivity: { type: Boolean, default: false }
    },
    preferences: {
      narratorVoice: { type: String, default: "Serena (Calm)" },
      ambientVolume: { type: Number, default: 40 },
      defaultDuration: { type: String, default: "15m" },
      theme: { type: String, default: "system" }
    }
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);