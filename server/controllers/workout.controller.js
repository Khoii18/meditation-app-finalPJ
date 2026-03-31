import { getExercises } from "../services/rag.service.js";
import { generatePlan } from "../services/ai.service.js";
import { getVideos } from "../services/youtube.service.js";
import Workout from "../models/workout.model.js";

export const createWorkout = async (req, res) => {
  try {
    const profile = req.body;

    // 🔥 1. RAG
    let exercises = getExercises(profile);

    // 🔥 2. AI generate plan
    const plan = await generatePlan(profile, exercises);

    // 🔥 3. YouTube videos
    const videos = await Promise.all(
      exercises.map(ex => getVideos(profile, ex.name))
    );

    // 🔥 4. Save history
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