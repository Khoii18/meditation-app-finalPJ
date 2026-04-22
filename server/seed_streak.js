import mongoose from "mongoose";
import Content from "./models/content.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedStreakData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/meditation-app");
        console.log("Connected to MongoDB for seeding...");

        // 1. Create Basic Meditation Pack for Streak Day 1
        const basicPack = {
            title: "Foundation: Session 1",
            duration: "10 min",
            instructor: "Balance Master",
            image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
            type: "Plan",
            subject: "Foundation (Unlocked)",
            iconName: "Flame",
            unlockedByStreak: "streak-1",
            description: "A simple introduction to mindfulness unlocked via your first streak."
        };

        // 2. Create Sleep Sounds for Streak Day 3
        const sleepSounds = [
            {
                title: "Premium: Rain & Thunder",
                duration: "Infinite",
                instructor: "Nature",
                image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800",
                type: "Sound",
                subject: "Premium Sleep (Unlocked)",
                iconName: "Zap",
                unlockedByStreak: "streak-3",
                description: "Deep heavy rain sounds for perfect sleep."
            },
            {
                title: "Premium: Forest Night",
                duration: "Infinite",
                instructor: "Nature",
                image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800",
                type: "Sound",
                subject: "Premium Sleep (Unlocked)",
                iconName: "Zap",
                unlockedByStreak: "streak-3",
                description: "The calm atmosphere of a forest at night."
            }
        ];

        // Delete existing ones to avoid duplicates if re-run
        await Content.deleteMany({ unlockedByStreak: { $in: ["streak-1", "streak-3"] } });

        await Content.create(basicPack);
        await Content.create(sleepSounds);

        console.log("Streak Rewards Data seeded successfully!");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedStreakData();
