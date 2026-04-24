import mongoose from "mongoose";
import Content from "./models/content.model.js";

const AUDIO_MEDITATION = "https://cdn.pixabay.com/download/audio/2022/05/16/audio_96489cbefd.mp3?filename=zen-spiritual-meditation-110820.mp3";
const AUDIO_SLEEP = "https://cdn.pixabay.com/download/audio/2022/01/21/audio_31743c58be.mp3?filename=ambient-piano-amp-strings-10711.mp3";
const AUDIO_SOUNDSCAPE = "https://cdn.pixabay.com/download/audio/2021/09/06/audio_01280f2d48.mp3?filename=soft-rain-ambient-111154.mp3";

const balanceContent = [
  // --- PLANS ---
  {
    title: "Foundations",
    type: "Plan",
    duration: "10 Days",
    instructor: "Ofosu",
    subject: "Learn to Meditate",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop",
    description: "Explore the basics of meditation and mindfulness in this 10-day foundational plan. Perfect for beginners to build a daily habit.",
    lessons: [
      { title: "Personalize your Plan", duration: "5 min", description: "Learn how personalization works and set your goals.", audioUrl: AUDIO_MEDITATION },
      { title: "Basics of Breath Control", duration: "10 min", description: "Discover how to control your breath to calm your mind.", audioUrl: AUDIO_MEDITATION },
      { title: "Breath Control tips", duration: "8 min", description: "Advanced tips for maintaining focus on your breath.", audioUrl: AUDIO_MEDITATION },
      { title: "Managing Distractions", duration: "10 min", description: "Learn to let go of wandering thoughts without judgment.", audioUrl: AUDIO_MEDITATION },
      { title: "Mid-Plan Review", duration: "5 min", description: "Reflect on your progress so far.", audioUrl: AUDIO_MEDITATION },
      { title: "Body Scan Basics", duration: "12 min", description: "A simple body scan to release physical tension.", audioUrl: AUDIO_MEDITATION },
      { title: "Focusing the Mind", duration: "10 min", description: "Train your mind to stay present.", audioUrl: AUDIO_MEDITATION },
      { title: "Dealing with Restlessness", duration: "10 min", description: "Techniques for when you can't sit still.", audioUrl: AUDIO_MEDITATION },
      { title: "Everyday Mindfulness", duration: "8 min", description: "Taking mindfulness off the cushion and into your day.", audioUrl: AUDIO_MEDITATION },
      { title: "End-of-Plan Review", duration: "5 min", description: "Celebrate your consistency and plan your next steps.", audioUrl: AUDIO_MEDITATION },
    ]
  },
  {
    title: "Relaxation",
    type: "Plan",
    duration: "10 Days",
    instructor: "Ofosu",
    subject: "Release Tension",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop",
    description: "Explore science-backed strategies to help you relax in this 10-day Plan.",
    lessons: [
      { title: "Personalize your Plan", duration: "5 min", description: "Tailor this plan to your stress triggers.", audioUrl: AUDIO_MEDITATION },
      { title: "Basics of Breath Control", duration: "10 min", description: "Use your breath as an anchor.", audioUrl: AUDIO_MEDITATION },
      { title: "Breath Control tips", duration: "10 min", description: "Deepening your breathing practice.", audioUrl: AUDIO_MEDITATION },
      { title: "Stress triggers", duration: "12 min", description: "Identifying what causes your stress.", audioUrl: AUDIO_MEDITATION },
      { title: "Mid-Plan review", duration: "5 min", description: "Checking in on your relaxation journey.", audioUrl: AUDIO_MEDITATION },
      { title: "Short- and long-term stress", duration: "10 min", description: "Understanding the difference.", audioUrl: AUDIO_MEDITATION },
      { title: "Symptoms of stress", duration: "10 min", description: "How stress manifests in the body.", audioUrl: AUDIO_MEDITATION },
      { title: "Positive and negative stress", duration: "10 min", description: "Not all stress is bad.", audioUrl: AUDIO_MEDITATION },
      { title: "Tips for managing stress", duration: "12 min", description: "Practical tools for everyday life.", audioUrl: AUDIO_MEDITATION },
      { title: "End-of-Plan review", duration: "5 min", description: "Reflecting on your new tools.", audioUrl: AUDIO_MEDITATION },
    ]
  },
  {
    title: "Advanced",
    type: "Plan",
    duration: "10 Days",
    instructor: "Leah",
    subject: "Advance Your Practice",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop",
    description: "Take your meditation practice to the next level with advanced techniques.",
    lessons: [
      { title: "Deep Awareness", duration: "15 min", description: "Cultivate a profound sense of presence.", audioUrl: AUDIO_MEDITATION },
      { title: "Non-Attachment", duration: "20 min", description: "Practice letting go of desires.", audioUrl: AUDIO_MEDITATION },
      { title: "Vipassana Intro", duration: "20 min", description: "Introduction to insight meditation.", audioUrl: AUDIO_MEDITATION },
      { title: "Sustained Focus", duration: "25 min", description: "Maintain concentration for longer periods.", audioUrl: AUDIO_MEDITATION },
      { title: "Mid-Plan Check-in", duration: "10 min", description: "Reflect on the challenges of deep practice.", audioUrl: AUDIO_MEDITATION },
      { title: "Equanimity", duration: "20 min", description: "Developing mental calmness and evenness of temper.", audioUrl: AUDIO_MEDITATION },
      { title: "Open Monitoring", duration: "20 min", description: "Observing thoughts without getting involved.", audioUrl: AUDIO_MEDITATION },
      { title: "Loving-Kindness", duration: "15 min", description: "Advanced Metta practice.", audioUrl: AUDIO_MEDITATION },
      { title: "Silent Retreat Prep", duration: "20 min", description: "Preparing for extended silence.", audioUrl: AUDIO_MEDITATION },
      { title: "Integration", duration: "15 min", description: "Bringing advanced mindfulness into daily life.", audioUrl: AUDIO_MEDITATION },
    ]
  },
  
  // --- SINGLES (Meditations) ---
  { title: "Wake Up", type: "Meditation", duration: "3 min", instructor: "Ofosu", subject: "Morning Meditations", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop", description: "A quick burst of energy to start your day.", audioUrl: AUDIO_MEDITATION },
  { title: "Morning Brew", type: "Meditation", duration: "5 min", instructor: "Leah", subject: "Morning Meditations", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop", description: "Mindful breathing to accompany your morning coffee.", audioUrl: AUDIO_MEDITATION },
  { title: "Gratitude", type: "Meditation", duration: "5 min", instructor: "Ofosu", subject: "Morning Meditations", image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=600&auto=format&fit=crop", description: "Cultivate a mindset of gratitude.", audioUrl: AUDIO_MEDITATION },
  
  { title: "Happiness", type: "Meditation", duration: "10 min", instructor: "Leah", subject: "Lift Your Mood", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop", description: "Boost your mood and find inner joy.", audioUrl: AUDIO_MEDITATION },
  { title: "Embrace Change", type: "Meditation", duration: "10 min", instructor: "Ofosu", subject: "Lift Your Mood", image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop", description: "Learn to flow with life's transitions.", audioUrl: AUDIO_MEDITATION },
  { title: "Energy", type: "Meditation", duration: "10 min", instructor: "Leah", subject: "Lift Your Mood", image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=600&auto=format&fit=crop", description: "Recharge your mental and physical batteries.", audioUrl: AUDIO_MEDITATION },

  { title: "Confidence", type: "Meditation", duration: "10 min", instructor: "Ofosu", subject: "Get Support", image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=600&auto=format&fit=crop", description: "Build self-esteem and inner strength.", audioUrl: AUDIO_MEDITATION },
  { title: "Ease Loneliness", type: "Meditation", duration: "10 min", instructor: "Leah", subject: "Get Support", image: "https://images.unsplash.com/photo-1517855653453-277573f0c18c?q=80&w=600&auto=format&fit=crop", description: "Find comfort in your own presence.", audioUrl: AUDIO_MEDITATION },
  { title: "Facing Fear", type: "Meditation", duration: "15 min", instructor: "Ofosu", subject: "Get Support", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=600&auto=format&fit=crop", description: "A guided practice to confront and overcome anxiety.", audioUrl: AUDIO_MEDITATION },
  
  // --- SLEEP STORIES & SOUNDSCAPES ---
  { title: "Immersive Forest", type: "Sleep Story", duration: "10 min", instructor: "Leah", subject: "For Later", image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop", description: "Wander through a peaceful, ancient forest.", audioUrl: AUDIO_SLEEP },
  { title: "Dream Scenes", type: "Sleep Story", duration: "20 min", instructor: "Ofosu", subject: "For Later", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop", description: "Visualize calming landscapes to drift off.", audioUrl: AUDIO_SLEEP },
  { title: "Rain", type: "Soundscape", duration: "60 min", instructor: "Nature", subject: "For Later", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=600&auto=format&fit=crop", description: "Continuous ambient sound of gentle rain.", audioUrl: AUDIO_SOUNDSCAPE },
  { title: "Deep Ocean", type: "Soundscape", duration: "60 min", instructor: "Nature", subject: "For Later", image: "https://images.unsplash.com/photo-1682687982501-1e5898cb4693?q=80&w=600&auto=format&fit=crop", description: "The calming, rhythmic sounds of deep ocean waves.", audioUrl: AUDIO_SOUNDSCAPE }
];

export const seedDatabaseIfNeeded = async () => {
  try {
    const count = await Content.countDocuments();
    if (count === 0) {
      console.log("Database is empty. Seeding highly polished Balance-like data...");
      for (const item of balanceContent) {
        await Content.create(item);
      }
      console.log("Professional Seeding complete!");
    } else {
      // If we only have the 9 items from the manual run, let's upgrade it to the 16 items
      if (count < 10) {
        console.log("Upgrading database to maximum completion...");
        await Content.deleteMany({});
        for (const item of balanceContent) {
          await Content.create(item);
        }
        console.log("Upgrade complete!");
      }
    }
  } catch (err) {
    console.error("Seeding error:", err);
  }
};
