import Review from "../models/review.model.js";

export const addReview = async (req, res) => {
  try {
    const { coachId, rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.create({
      userId,
      coachId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCoachReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ coachId: req.params.id })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
