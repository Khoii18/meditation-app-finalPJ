import SessionProgress from "../models/sessionProgress.model.js";
import User from "../models/user.model.js";

const COMPLETION_THRESHOLD = 0.85;

export const startOrUpdateSession = async (req, res) => {
  try {
    const { contentId, contentTitle, totalDuration, watchedDuration } = req.body;
    const userId = req.user.id;

    const isCompleted = totalDuration > 0 && (watchedDuration / totalDuration) >= COMPLETION_THRESHOLD;

    const session = await SessionProgress.findOneAndUpdate(
      { userId, contentId },
      {
        $set: {
          contentTitle,
          totalDuration,
          watchedDuration,
          completed: isCompleted,
          lastActiveAt: new Date(),
          ...(isCompleted ? { completedAt: new Date() } : {}),
        },
        $setOnInsert: { startedAt: new Date(), notified: false },
      },
      { upsert: true, new: true }
    );

    if (isCompleted) {
      await User.findByIdAndUpdate(userId, {
        $inc: { "stats.totalSessions": 1 },
      });
    }

    res.json({ session, isCompleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getIncompleteReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const sessions = await SessionProgress.find({
      userId,
      completed: false,
      notified: false,
      watchedDuration: { $gt: 10 },
      lastActiveAt: { $lt: thirtyMinsAgo },
    }).sort({ lastActiveAt: -1 }).limit(5);

    if (sessions.length > 0) {
      await SessionProgress.updateMany(
        { _id: { $in: sessions.map(s => s._id) } },
        { $set: { notified: true } }
      );
    }

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomplete = await SessionProgress.find({
      userId,
      completed: false,
      watchedDuration: { $gt: 10 },
    }).sort({ lastActiveAt: -1 }).limit(10);

    const recent = await SessionProgress.find({
      userId,
      completed: true,
    }).sort({ completedAt: -1 }).limit(5);

    res.json({ incomplete, recentCompleted: recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAdminSessionStats = async (req, res) => {
  try {
    const incomplete = await SessionProgress.find({ completed: false, watchedDuration: { $gt: 10 } })
      .populate("userId", "name email avatar")
      .sort({ lastActiveAt: -1 })
      .limit(50);

    const completed = await SessionProgress.find({ completed: true })
      .populate("userId", "name email avatar")
      .sort({ completedAt: -1 })
      .limit(50);

    res.json({ incomplete, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
