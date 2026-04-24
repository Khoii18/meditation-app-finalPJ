import DailyRecommendation from "../models/dailyRecommendation.model.js";
import Content from "../models/content.model.js";

export const getRecommendations = async (req, res) => {
  try {
    const recs = await DailyRecommendation.find().populate("contentId").sort({ day: 1 });
    res.json(recs);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateRecommendation = async (req, res) => {
  try {
    const { day, contentId, note } = req.body;
    
    const content = await Content.findById(contentId);
    if (!content) return res.status(404).json("Content not found");

    const updated = await DailyRecommendation.findOneAndUpdate(
      { day },
      { contentId, title: content.title, note },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const deleteRecommendation = async (req, res) => {
  try {
    await DailyRecommendation.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
