import Workout from "../models/workout.model.js";
import Checkin from "../models/checkin.model.js";
import Content from "../models/content.model.js";
import User from "../models/user.model.js";

const getLocalDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().split('T')[0];
};

export const getTodayJourney = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getLocalDate();

    const checkin = await Checkin.findOne({ userId, date: today });
    const user = await User.findById(userId);

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const workouts = await Workout.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    let completedExercises = [];
    workouts.forEach(w => {
      if (Array.isArray(w.exercises) && w.exercises.length > 0) {
        completedExercises.push(...w.exercises);
      } else if (w.plan) {
        completedExercises.push({ name: w.plan.name || "Daily AI Plan" });
      } else if (w.contentTitle) {
        completedExercises.push({ name: w.contentTitle });
      }
    });

    let advice = "You haven't checked in today. Take a moment to log your mood!";
    if (checkin) {
      const skillSum = (user.skills?.focus || 0) + (user.skills?.relaxation || 0);
      if (skillSum > 10) {
        advice = `Impressive progress! Your mindfulness skills are growing. Since you're feeling ${checkin.mood}, why not try an Advanced session?`;
      } else {
        advice = `Welcome back! We noticed you're feeling ${checkin.mood}. Based on your ${completedExercises.length} sessions today, you're building a great habit!`;
      }
    }

    const dbSuggestions = await Content.aggregate([{ $sample: { size: 2 } }]);
    const suggestions = dbSuggestions.map(item => ({
      id: item._id,
      title: item.title,
      duration: item.duration,
      type: item.type
    }));

    res.status(200).json({
      checkin: checkin || null,
      completedExercises,
      advice,
      suggestions,
      skills: user.skills || { focus: 0, relaxation: 0, breathControl: 0, awareness: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeSession = async (req, res) => {
  try {
    const { contentId, durationMinutes } = req.body;
    const userId = req.user.id;

    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json("Content not found");

    let skillToUpdate = "focus";
    const sub = (content.subject || "").toLowerCase();
    const type = (content.type || "").toLowerCase();

    if (sub.includes("breath") || sub.includes("focus") || sub.includes("tập trung")) skillToUpdate = "focus";
    else if (sub.includes("body scan") || sub.includes("relax") || sub.includes("thư giãn") || type.includes("sleep")) skillToUpdate = "relaxation";
    else if (sub.includes("awareness") || sub.includes("labeling") || sub.includes("nhận thức")) skillToUpdate = "awareness";
    else skillToUpdate = "breathControl";

    await User.findByIdAndUpdate(userId, {
      $inc: { 
        [`skills.${skillToUpdate}`]: 5,
        "stats.totalSessions": 1,
        "stats.mindfulMinutes": durationMinutes || 5
      }
    });

    await Workout.create({
      userId,
      contentTitle: content.title,
      contentId: content._id,
      skillEarned: skillToUpdate
    });

    res.json({ success: true, skillEarned: skillToUpdate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
