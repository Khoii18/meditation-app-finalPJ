import User from "../models/user.model.js";

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");
    
    // Ensure stats exist
    if (!user.stats) {
      user.stats = { currentStreak: 0, longestStreak: 0, totalSessions: 0, mindfulMinutes: 0, lastCheckInDate: null };
      await user.save();
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
