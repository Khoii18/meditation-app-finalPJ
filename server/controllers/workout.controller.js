import { getExercises } from "../services/rag.service.js";
import { generatePlan } from "../services/ai.service.js";
import { getVideos } from "../services/youtube.service.js";
import Workout from "../models/workout.model.js";

export const createWorkout = async (req, res) => {
  try {
    const profile = req.body;

    let exercises = getExercises(profile);

    const plan = await generatePlan(profile, exercises);

    const videos = await Promise.all(
      exercises.map(ex => getVideos(profile, ex.name))
    );

    await Workout.create({
      userId: req.user.id,
      plan,
      exercises
    });

    res.json({
      plan,
      videos
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
};