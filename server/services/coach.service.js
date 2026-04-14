import axios from "axios";
import Content from "../models/content.model.js";

/**
 * DEFINITIVE FAIL-SAFE AI COACH SERVICE
 * Uses Gemini via OpenAI-Compatible Endpoint (Most Stable)
 */
export const generateMeditationPlan = async (mood) => {
  const m = (mood || "").trim();
  console.log(`[AI COACH] Ultimate process for mood: "${m}"`);
  
  let catalog = [];
  try {
    catalog = await Content.find({}).limit(15);
  } catch (e) {}
  const catalogStr = catalog.map(c => `- ${c.title} (${c.duration})`).join("\n") || "Standard meditation list";

  // Expert Fallback (Always ready if cloud fails)
  const getExpertFallback = (text) => {
    const lowText = text.toLowerCase();
    if (lowText.includes("stress") || lowText.includes("lo lắng") || lowText.includes("anxious") || lowText.includes("mệt")) {
      return {
        title: "Peaceful Mind Protocol",
        description: "A calming sequence designed to lower your heart rate and quiet a racing mind.",
        steps: [
          { name: "Morning Clarity Breathwork", duration: "5 min", type: "Breathing" },
          { name: "Anxiety Relief: Grounding", duration: "10 min", type: "Guided Med" }
        ]
      };
    }
    return {
      title: "Mindful Presence Session",
      description: `Tailored flow for your feeling of "${m}".`,
      steps: [
        { name: "Focus: Flow State Activation", duration: "15 min", type: "Focus" },
        { name: "Gentle Morning Stretching", duration: "12 min", type: "Yoga" }
      ]
    };
  };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Key missing");

    // Using Gemini's OpenAI-Compatible Endpoint (v1beta/openai)
    // This is the most robust way to call Gemini now.
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions?key=${apiKey}`,
      {
        model: "gemini-1.5-flash", // Also try "gemini-pro" if flash fails
        messages: [
          { role: "system", content: "You are a professional meditation coach. Respond only in valid JSON." },
          { role: "user", content: `Mood: ${m}\nCatalog:\n${catalogStr}\n\nTask: Create 2-3 step plan. JSON: { "title": "...", "description": "...", "steps": [{"name": "...", "duration": "...", "type": "..."}] }` }
        ],
        response_format: { type: "json_object" }
      },
      { timeout: 9000 }
    );

    if (res.data?.choices?.[0]?.message?.content) {
      const aiPlan = JSON.parse(res.data.choices[0].message.content);
      console.log("[AI COACH] Successfully generated via OpenAI Compatibility Layer!");
      return aiPlan;
    }
    throw new Error("Empty response from AI");

  } catch (err) {
    console.warn(`[AI COACH] API failed: ${err.message}. Using Expert Fallback.`);
    return getExpertFallback(m);
  }
};
