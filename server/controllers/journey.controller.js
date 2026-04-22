import Workout from "../models/workout.model.js";
import Checkin from "../models/checkin.model.js";
import Content from "../models/content.model.js";

export const getTodayJourney = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const checkin = await Checkin.findOne({ userId, date: today });

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
        completedExercises.push({ name: "Daily AI Workout Plan" });
      }
    });

    let advice = "You haven't checked in today. Take a moment to log your mood!";
    if (checkin) {
      if (checkin.mood === "Happy" || checkin.mood === "Peaceful") {
        advice = `Since you're feeling ${checkin.mood} today and completed ${completedExercises.length} sessions, keep up the positive momentum! Try our new advanced meditation.`;
      } else {
        advice = `We noticed you're feeling ${checkin.mood || 'okay'} today. Based on your completed ${completedExercises.length} sessions, we highly recommend a quick wind-down sleep story to recharge your energy tonight.`;
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
      suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
