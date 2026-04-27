import Checkin from "../models/checkin.model.js";
import User from "../models/user.model.js";

export const addCheckin = async (req, res) => {
  try {
    const { sleep, energy, goal, mood, moodNote } = req.body;
    
    const today = new Date().toISOString().split('T')[0];

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.stats) {
      user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
    }

    if (user.stats.lastCheckInDate === today) {
      return res.status(400).json({ message: "Already checked in today.", streak: user.stats.currentStreak });
    }

    let newStreak = 1;

    if (user.stats.lastCheckInDate) {
      const last = new Date(user.stats.lastCheckInDate + "T00:00:00Z");
      const curr = new Date(today + "T00:00:00Z");
      const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = user.stats.currentStreak + 1;
      } else if (diffDays === 0) {
        newStreak = user.stats.currentStreak;
      }
    }

    user.stats.currentStreak = newStreak;
    user.stats.lastCheckInDate = today;
    if (newStreak > user.stats.longestStreak) {
      user.stats.longestStreak = newStreak;
    }

    await user.save();

    const newCheckin = await Checkin.create({
      userId,
      sleep,
      energy,
      goal,
      mood: mood || null,
      moodNote: moodNote || null,
      date: today
    });

    res.status(200).json({
      message: "Check-in successful",
      streak: user.stats.currentStreak,
      user
    });

  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const updateMood = async (req, res) => {
  try {
    const { mood, moodNote } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const userId = req.user.id;

    let checkin = await Checkin.findOne({ userId, date: today });

    if (!checkin) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.stats) {
        user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
      }

      if (user.stats.lastCheckInDate !== today) {
        let newStreak = 1;
        if (user.stats.lastCheckInDate) {
          const last = new Date(user.stats.lastCheckInDate + "T00:00:00Z");
          const curr = new Date(today + "T00:00:00Z");
          const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) newStreak = user.stats.currentStreak + 1;
        }
        user.stats.currentStreak = newStreak;
        user.stats.lastCheckInDate = today;
        if (newStreak > user.stats.longestStreak) user.stats.longestStreak = newStreak;
        await user.save();
      }

      checkin = await Checkin.create({
        userId,
        mood: mood || null,
        moodNote: moodNote || null,
        date: today
      });

      return res.status(200).json({
        message: "Mood saved and check-in created",
        checkin,
        streak: user.stats.currentStreak
      });
    }

    checkin.mood = mood;
    checkin.moodNote = moodNote;
    await checkin.save();

    res.status(200).json({
      message: "Mood updated successfully",
      checkin
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
