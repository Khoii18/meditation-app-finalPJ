import Content from "../models/content.model.js";
import { GoogleGenAI } from "@google/genai";

export const generateMeditationPlan = async (mood) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  let contextData = "No specific catalog available, generate generic steps.";
  try {
    // 1. Retrieval: Fetch all active content as source of truth
    const contents = await Content.find({}).limit(20);
    if (contents && contents.length > 0) {
      contextData = contents.map(c => 
        `- Title: "${c.title}" | Type: ${c.type} | Duration: ${c.duration}`
      ).join('\n');
    }
  } catch (err) {
    console.error("RAG Retrieval Error:", err.message);
  }

  // 2. Augmentation: Build Prompt with Context
  const prompt = `
You are a professional mindfulness and meditation coach.

User's current mood/state:
"${mood}"

Here is the CATALOG of available audio meditations from our database:
${contextData}

Based on the user's mood, create a custom meditation plan. 
IMPORTANT RULES:
- You MUST select 2 or 3 items ONLY from the CATALOG above to form the "steps" of the plan.
- For each step, the "name", "duration", and "type" MUST exactly match the catalog item.
- Do NOT make up new meditation steps.

Return ONLY valid JSON in this exact format, with no extra text or markdown wrappers:
{
  "title": "A short, calming English title",
  "description": "A very brief 1-2 English sentence description explaining why this plan helps their mood.",
  "steps": [
    {
      "name": "Exact title from catalog",
      "duration": "Exact duration from catalog",
      "type": "Exact type from catalog"
    }
  ]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const output = response.text;

    if (!output) throw new Error("No response from AI");

    return JSON.parse(output);

  } catch (err) {
    console.log("AI ERROR:", err.message);

    // Fallback based on mood
    return {
      title: "Emergency Relaxation Plan",
      description: `We notice you are feeling "${mood}". Please take a moment to unwind. This fallback plan helps reset your nerves.`,
      steps: [
        { name: "Mindful Start", duration: "5 min", type: "Breathing" },
        { name: "Deep Let Go", duration: "10 min", type: "Deep Relaxation" }
      ]
    };
  }
};
