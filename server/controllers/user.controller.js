import User from "../models/user.model.js";
import Checkin from "../models/checkin.model.js";
import bcrypt from "bcryptjs";

// Public: get all coaches with their profiles and packages
export const getAllCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ role: "coach" })
      .select("-password -stats")
      .sort({ createdAt: -1 });
    res.json(coaches);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Public: get a single coach by ID
export const getCoachById = async (req, res) => {
  try {
    const coach = await User.findOne({ _id: req.params.id, role: "coach" })
      .select("-password -stats");
    if (!coach) return res.status(404).json("Coach not found");
    res.json(coach);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Coach: update own coach profile & packages
export const updateCoachProfile = async (req, res) => {
  try {
    const { bio, specialties, avatar, plans, introVideo } = req.body;
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "coach") return res.status(403).json("Coach only");

    if (bio !== undefined)         user.coachProfile.bio = bio;
    if (specialties !== undefined) user.coachProfile.specialties = specialties;
    if (avatar !== undefined)      user.coachProfile.avatar = avatar;
    if (introVideo !== undefined)  user.coachProfile.introVideo = introVideo;
    if (plans !== undefined)       user.coachProfile.plans = plans;

    await user.save();
    res.json({ message: "Profile updated", coachProfile: user.coachProfile });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateAccountSettings = async (req, res) => {
  try {
    const { password, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");
    
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");

    if (!user.stats) {
      user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
    } else if (user.stats.lastCheckInDate) {
      const today = new Date().toISOString().split('T')[0];
      const last = new Date(user.stats.lastCheckInDate + "T00:00:00Z");
      const curr = new Date(today + "T00:00:00Z");
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

      // If they missed more than 1 day since last check-in, streak resets to 0
      // Note: diffDays === 1 means they checked in yesterday, so streak is still alive
      if (diffDays > 1) {
        user.stats.currentStreak = 0;
        await user.save();
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: get all users with stats
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: get mood analytics across all users
export const getMoodAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    const sinceStr = since.toISOString().split('T')[0];

    const checkins = await Checkin.find({ date: { $gte: sinceStr } })
      .select('mood sleep energy date userId')
      .populate('userId', 'name')
      .sort({ date: -1 });

    // Mood distribution
    const moodCount = { Angry: 0, Sad: 0, Neutral: 0, Peaceful: 0, Happy: 0 };
    const sleepCount = {};
    const energyCount = {};
    const dailyMood = {};

    checkins.forEach(c => {
      if (c.mood && moodCount[c.mood] !== undefined) moodCount[c.mood]++;
      if (c.sleep) sleepCount[c.sleep] = (sleepCount[c.sleep] || 0) + 1;
      if (c.energy) energyCount[c.energy] = (energyCount[c.energy] || 0) + 1;
      if (c.mood && c.date) {
        if (!dailyMood[c.date]) dailyMood[c.date] = {};
        dailyMood[c.date][c.mood] = (dailyMood[c.date][c.mood] || 0) + 1;
      }
    });

    res.json({
      total: checkins.length,
      moodDistribution: moodCount,
      sleepDistribution: sleepCount,
      energyDistribution: energyCount,
      dailyMood,
      recent: checkins.slice(0, 50),
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
export const getUserCheckins = async (req, res) => {
  try {
    const checkins = await Checkin.find({ userId: req.params.id })
      .sort({ date: -1 })
      .limit(30);
    res.json(checkins);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: update a user's role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowed = ["user", "coach", "admin"];
    if (!allowed.includes(role)) return res.status(400).json("Invalid role");
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// Admin: delete a user
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Checkin.deleteMany({ userId: req.params.id });
    res.json("User deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
