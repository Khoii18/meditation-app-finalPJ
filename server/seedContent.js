import 'dotenv/config';
import mongoose from "mongoose";
import Content from "./models/content.model.js";

const dummyData = [
  {
    title: "Morning Clarity Breathwork",
    duration: "5 min",
    instructor: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&q=80&w=800",
    type: "Breathing",
    description: "Start your day with clear focus using simple rhythmic breathing patterns.",
    audioUrl: ""
  },
  {
    title: "Deep Sleep Body Scan",
    duration: "15 min",
    instructor: "Dr. Alan Reid",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b1cf484?auto=format&fit=crop&q=80&w=800",
    type: "Sleep",
    description: "A progressive muscle relaxation technique to melt away the day's stress and prepare your body for deep rest.",
    audioUrl: ""
  },
  {
    title: "Anxiety Relief: Grounding Technique",
    duration: "10 min",
    instructor: "Maya Patel",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=800",
    type: "Guided Meditation",
    description: "Find your center during anxious moments using the 5-4-3-2-1 grounding method.",
    audioUrl: ""
  },
  {
    title: "Mid-day Energy Boost",
    duration: "7 min",
    instructor: "Sarah Jenkins",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    type: "Movement & Breath",
    description: "A quick pick-me-up combining light stretching and energizing breaths.",
    audioUrl: ""
  },
  {
    title: "Healing from Heartbreak",
    duration: "20 min",
    instructor: "Elena Rostova",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=800",
    type: "Healing Meditation",
    description: "Gentle words of affirmation and self-compassion to help soothe emotional pain.",
    audioUrl: ""
  },
  {
    title: "Focus: Flow State Activation",
    duration: "15 min",
    instructor: "David Kim",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800",
    type: "Focus",
    description: "A concentration practice using binaural beats and single-point focus techniques.",
    audioUrl: ""
  },
  {
    title: "SOS Panic Attack Support",
    duration: "3 min",
    instructor: "Dr. Alan Reid",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    type: "Emergency Support",
    description: "Immediate guidance to slow heart rate and restore calm during a panic episode.",
    audioUrl: ""
  },
  {
    title: "Gentle Morning Stretching",
    duration: "12 min",
    instructor: "Maya Patel",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    type: "Yoga Stretch",
    description: "Wake up your spine and joints with mindful, slow movements.",
    audioUrl: ""
  },
  {
    title: "Forest Rain Soundscape",
    duration: "60 min",
    instructor: "NatureSounds",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800",
    type: "Soundscape",
    description: "Pure, high-fidelity ambient rain recorded in the Pacific Northwest.",
    audioUrl: ""
  },
  {
    title: "Confidence & Self-Worth Affirmations",
    duration: "8 min",
    instructor: "Elena Rostova",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800",
    type: "Affirmations",
    description: "Build intrinsic motivation and confidence before big daily challenges.",
    audioUrl: ""
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, seeding contents...");
    try {
      await Content.deleteMany({ instructor: { $in: ["Sarah Jenkins", "Dr. Alan Reid", "Maya Patel", "Elena Rostova", "David Kim", "NatureSounds"] } });
      await Content.insertMany(dummyData);
      console.log("Successfully seeded 10 new high-quality contents for RAG AI!");
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error("DB Connection error:", err);
    process.exit(1);
  });
