import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import Checkin from "../models/checkin.model.js";

// ─── Public: Get all coaches ──────────────────────────────────────────────────
export const getCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" })
      .select("name coachProfile createdAt")
      .lean();

    // Attach member counts
    const withCounts = await Promise.all(coaches.map(async (c) => {
      const memberCount = await Subscription.countDocuments({ coachId: c._id, status: "active" });
      return { ...c, memberCount };
    }));

    res.json(withCounts);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── Public: Get single coach ─────────────────────────────────────────────────
export const getCoachById = async (req, res) => {
  try {
    const coach = await User.findOne({ _id: req.params.id, role: "coach" })
      .select("name coachProfile createdAt")
      .lean();
    if (!coach) return res.status(404).json("Coach not found");
    const memberCount = await Subscription.countDocuments({ coachId: coach._id, status: "active" });
    res.json({ ...coach, memberCount });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── User: Subscribe to a coach ───────────────────────────────────────────────
export const subscribe = async (req, res) => {
  try {
    const { coachId, planName } = req.body;
    const userId = req.user.id;

    // Verify coach exists
    const coach = await User.findOne({ _id: coachId, role: "coach" });
    if (!coach) return res.status(404).json("Coach not found");

    // Upsert subscription
    const sub = await Subscription.findOneAndUpdate(
      { userId, coachId },
      { planName, status: "active", startDate: new Date() },
      { upsert: true, new: true }
    );
    res.json(sub);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── User: Cancel subscription ────────────────────────────────────────────────
export const unsubscribe = async (req, res) => {
  try {
    const { coachId } = req.params;
    await Subscription.findOneAndUpdate(
      { userId: req.user.id, coachId },
      { status: "cancelled" }
    );
    res.json("Unsubscribed");
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── User: Get my subscriptions ───────────────────────────────────────────────
export const getMySubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user.id, status: "active" })
      .populate("coachId", "name coachProfile");
    res.json(subs);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── Coach: Get member stats (NO personal info, aggregate only) ───────────────
export const getMyMemberStats = async (req, res) => {
  try {
    const coachId = req.user.id;

    // Get all active subscribers
    const subs = await Subscription.find({ coachId, status: "active" })
      .populate("userId", "stats"); // only stats, NO name/email

    const totalMembers  = subs.length;
    const avgStreak     = subs.reduce((sum, s) => sum + (s.userId?.stats?.currentStreak || 0), 0) / (totalMembers || 1);
    const avgSessions   = subs.reduce((sum, s) => sum + (s.userId?.stats?.totalSessions || 0), 0) / (totalMembers || 1);
    const activeToday   = subs.filter(s => {
      const today = new Date().toISOString().split("T")[0];
      return s.userId?.stats?.lastCheckInDate === today;
    }).length;

    // Aggregate mood data for members only
    const memberIds = subs.map(s => s.userId?._id).filter(Boolean);
    const since30   = new Date(); since30.setDate(since30.getDate() - 30);
    const since30Str = since30.toISOString().split("T")[0];

    const checkins = await Checkin.find({
      userId: { $in: memberIds },
      date:   { $gte: since30Str }
    }).select("mood sleep energy date");

    const moodCount = { Angry: 0, Sad: 0, Neutral: 0, Peaceful: 0, Happy: 0 };
    checkins.forEach(c => {
      if (c.mood && moodCount[c.mood] !== undefined) moodCount[c.mood]++;
    });

    // Plan distribution
    const planDist = subs.reduce((acc, s) => {
      acc[s.planName] = (acc[s.planName] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalMembers,
      activeToday,
      avgStreak:   Math.round(avgStreak * 10) / 10,
      avgSessions: Math.round(avgSessions * 10) / 10,
      moodDistribution: moodCount,
      planDistribution: planDist,
      totalCheckins: checkins.length,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── Coach: Get detailed list of members ──────────────────────────────────────
export const getMyMembers = async (req, res) => {
  try {
    const coachId = req.user.id;
    const subs = await Subscription.find({ coachId })
      .populate("userId", "name email avatar stats")
      .sort({ createdAt: -1 });
    
    res.json(subs);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// ─── Coach: Update my coach profile ──────────────────────────────────────────
export const updateCoachProfile = async (req, res) => {
  try {
    const { bio, specialties, avatar, plans } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { coachProfile: { bio, specialties, avatar, plans } },
      { new: true }
    ).select("name coachProfile");
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
