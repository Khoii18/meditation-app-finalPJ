import User from "../models/user.model.js";
import Checkin from "../models/checkin.model.js";
import Content from "../models/content.model.js";
import bcrypt from "bcryptjs";

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
    const { password, currentPassword, avatar, name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");
    
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json("Email already in use");
      user.email = email;
    }

    if (password) {
      if (!currentPassword) return res.status(400).json("Current password is required to set a new one");
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json("Current password incorrect");
      
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }
    if (avatar !== undefined) user.avatar = avatar;
    if (name !== undefined)   user.name = name;
    
    await user.save();
    const userObj = user.toObject();
    delete userObj.password;
    res.json(userObj);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const { notifications, preferences } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    if (notifications) {
      user.settings.notifications = { ...user.settings.notifications, ...notifications };
    }
    if (preferences) {
      user.settings.preferences = { ...user.settings.preferences, ...preferences };
    }

    await user.save();
    res.json({ message: "Settings updated", settings: user.settings });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("activePlan");

    if (!user) return res.status(404).json("User not found");

    if (!user.stats) {
      user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
    } else if (user.stats.lastCheckInDate) {
      const today = new Date().toISOString().split('T')[0];
      const last = new Date(user.stats.lastCheckInDate + "T00:00:00Z");
      const curr = new Date(today + "T00:00:00Z");
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

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

export const onboardUser = async (req, res) => {
  try {
    const { goals, experience } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    user.onboardingAnswers = { goals, experience };

    let planTitle = "Foundations";
    if (goals.includes("stress")) planTitle = "Relaxation";
    else if (goals.includes("sleep")) planTitle = "Sleep";
    else if (experience === "often") planTitle = "Advanced";

    const selectedPlan = await Content.findOne({ type: { $regex: /plan/i }, title: { $regex: new RegExp(planTitle, "i") } });
    if (selectedPlan) {
      user.activePlan = selectedPlan._id;
      user.planProgress = 0;
    } else {
      const anyPlan = await Content.findOne({ type: { $regex: /plan/i } });
      if (anyPlan) user.activePlan = anyPlan._id;
    }

    await user.save();
    res.json({ message: "Onboarding complete", user });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

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

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Checkin.deleteMany({ userId: req.params.id });
    res.json("User deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
export const claimReward = async (req, res) => {
  try {
    const { rewardId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    if (user.claimedRewards.includes(rewardId)) {
      return res.status(400).json("Reward already claimed");
    }

    const rewardsMap = {
      "streak-1": 1,
      "streak-3": 3,
      "streak-7": 7,
      "streak-14": 14,
      "streak-30": 30,
    };

    const required = rewardsMap[rewardId];
    if (!required) return res.status(400).json("Invalid reward ID");

    if (user.stats.longestStreak < required) {
      return res.status(400).json(`You need a ${required}-day streak to claim this reward.`);
    }

    user.claimedRewards.push(rewardId);
    await user.save();

    res.json({ message: "Reward claimed successfully!", claimedRewards: user.claimedRewards });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateUserPremium = async (req, res) => {
  try {
    const { isPremium, planType } = req.body;
    const now = new Date();
    const expiry = new Date();
    if (planType === "monthly") expiry.setDate(now.getDate() + 30);
    else if (planType === "annual") expiry.setDate(now.getDate() + 365);
    else expiry.setFullYear(now.getFullYear() + 99);

    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        "premiumStatus.isPremium": isPremium,
        "premiumStatus.planType": planType,
        "premiumStatus.startDate": now,
        "premiumStatus.expiryDate": expiry
      }
    }, { new: true }).select("-password");
    
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateSkills = async (req, res) => {
  try {
    const { skill, points } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json("User not found");

    if (!user.skills) {
      user.skills = { focus: 0, relaxation: 0, breathControl: 0, awareness: 0 };
    }

    if (user.skills[skill] !== undefined) {
      user.skills[skill] += points;
      await user.save();
      res.json({ message: "Skills updated", skills: user.skills });
    } else {
      res.status(400).json("Invalid skill key");
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
};
