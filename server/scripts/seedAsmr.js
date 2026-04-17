import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // load from server folder
import Content from '../models/content.model.js';

// The hardcoded DB string we saw just in case
const MONGO_URI = 'mongodb://AIkhoi:123456%40@cluster0-shard-00-00.c34s7.mongodb.net:27017,cluster0-shard-00-01.c34s7.mongodb.net:27017,cluster0-shard-00-02.c34s7.mongodb.net:27017/meditation?ssl=true&replicaSet=atlas-7rktoz-shard-0&authSource=admin';

const asmrSounds = [
  {
    title: "Heavy Rain ASMR",
    duration: "45 min",
    instructor: "Nature",
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80",
    type: "Soundscape",
    description: "Deep heavy rain sounds to help you fall asleep.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Cozy Fireplace ASMR",
    duration: "60 min",
    instructor: "Nature",
    image: "https://images.unsplash.com/photo-1498677231914-500e9f70898a?w=800&q=80",
    type: "Soundscape",
    description: "Crackling campfire with warm ambient noise.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Forest Wind ASMR",
    duration: "40 min",
    instructor: "Nature",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80",
    type: "Soundscape",
    description: "Wind rustling through the canopy of a dark forest.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    title: "Ocean Waves ASMR",
    duration: "120 min",
    instructor: "Nature",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    type: "Soundscape",
    description: "Rhythmic waves crashing on a serene beach at midnight.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  }
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Remove any previous Soundscapes strictly to clean it up before adding new ones
    await Content.deleteMany({ type: 'Soundscape' });
    console.log("Cleared old ASMR Soundscapes");

    await Content.insertMany(asmrSounds);
    console.log("Successfully seeded 4 ASMR Sounds");

    mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding ASMR:", err);
    mongoose.disconnect();
  }
}

run();
