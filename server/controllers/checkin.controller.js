import Checkin from "../models/checkin.model.js";
import User from "../models/user.model.js";

export const addCheckin = async (req, res) => {
  try {
    const { sleep, energy, goal } = req.body;
    
    // YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure stats object exists
    if (!user.stats) {
      user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
    }

    // Checking if already checked in today
    if (user.stats.lastCheckInDate === today) {
      return res.status(400).json({ message: "Already checked in today.", streak: user.stats.currentStreak });
    }

    // Logic for Streak
    let newStreak = 1;

    if (user.stats.lastCheckInDate) {
      const lastCheckIn = new Date(user.stats.lastCheckInDate);
      const currentTime = new Date(today);
      
      const diffTime = Math.abs(currentTime - lastCheckIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak = user.stats.currentStreak + 1;
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
