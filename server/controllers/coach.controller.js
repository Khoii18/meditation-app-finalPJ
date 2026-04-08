import { generateMeditationPlan } from "../services/coach.service.js";

export const createPlan = async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      return res.status(400).json("Mood is required");
    }

    const plan = await generateMeditationPlan(mood);

    res.json({ plan });

  } catch (err) {
    res.status(500).json(err.message);
  }
};
