import mongoose from "mongoose";
import 'dotenv/config';
import Content from "./models/content.model.js";
import DailyRecommendation from "./models/dailyRecommendation.model.js";

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to seed 30-day routine");

  // 1. Ensure we have 30 content items of type "Morning"
  // If not, we'll create some dummy ones
  let morningContent = await Content.find({ tags: "Morning" }).limit(30);
  
  if (morningContent.length < 30) {
    console.log("Creating dummy morning content...");
    for (let i = morningContent.length + 1; i <= 30; i++) {
      const newItem = await Content.create({
        title: `Morning Routine Day ${i}`,
        description: `A peaceful start to your day ${i}. Focus on your breath and intentions.`,
        type: "meditation",
        tags: ["Morning", "Focus"],
        duration: "10 min",
        image: `https://images.unsplash.com/photo-1470252649358-969e6c24309f?q=80&w=600&auto=format&fit=crop`,
        isPremium: i > 7
      });
      morningContent.push(newItem);
    }
  }

  // 2. Map them to recommendations
  await DailyRecommendation.deleteMany({});
  for (let i = 0; i < 30; i++) {
    await DailyRecommendation.create({
      day: i + 1,
      contentId: morningContent[i]._id,
      title: morningContent[i].title,
      note: `Welcome to Day ${i + 1}. Start your day with clarity.`
    });
  }

  console.log("Seed complete: 30 days of morning routine mapped.");
  process.exit();
}

seed();
