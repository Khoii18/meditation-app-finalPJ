import User from "../models/user.model.js";
import Content from "../models/content.model.js";

const generateStandardResponse = (prompt) => {
    const input = prompt.toLowerCase();
    const knowledgeBase = [
      {
        id: "stress",
        matches: ["stress", "anxious", "pressure", "overwhelmed", "worry", "tension"],
        message: "Your soul reflects the weight of the world. Let us find the stillness within the storm.",
        exercise: {
          name: "The Breath of Dissolution",
          steps: [
            "Sit in a posture of dignity and soft presence.",
            "Breathe in the light of the present moment (4s).",
            "Hold, feeling the life force within you (2s).",
            "Exhale all that no longer serves you (6s).",
            "Return to the silence of your heart."
          ]
        },
        quote: "Silence is the language of God, all else is poor translation."
      },
      {
        id: "tired",
        matches: ["tired", "exhausted", "burnout", "weary", "energy"],
        message: "You are not a machine, but a garden that requires rest to bloom again.",
        exercise: {
          name: "Sacred Restoration Scan",
          steps: [
            "Surrender your weight to the earth beneath you.",
            "Soften the gaze of your inner eye.",
            "Direct your breath to the areas of fatigue.",
            "Imagine a golden mist of healing entering your pores.",
            "Rest in the knowledge that you are enough."
          ]
        },
        quote: "Nature does not hurry, yet everything is accomplished."
      }
    ];

    let bestMatch = null;
    let maxHits = 0;
    for (const item of knowledgeBase) {
        const hits = item.matches.filter(keyword => input.includes(keyword)).length;
        if (hits > maxHits) { maxHits = hits; bestMatch = item; }
    }

    if (bestMatch) return { ...bestMatch, mode: "Lunaria Lite" };

    return {
      message: "I witness your presence. Let us enter the gateway of silence together.",
      exercise: {
        name: "Universal Alignment",
        steps: [
          "Focus on the gentle rising and falling of your chest.",
          "Let thoughts pass like clouds in an infinite sky.",
          "Feel the connection between your breath and the universe.",
          "Rest in the awareness of the here and now."
        ]
      },
      quote: "Be still, and know.",
      mode: "Lunaria Lite"
    };
};

export const generateAiPlan = async (req, res) => {
  try {
    const { prompt, mode } = req.body;
    const userId = req.user.id;

    if (!prompt) return res.status(400).json("Input required.");

    if (mode === "standard") {
      return res.json(generateStandardResponse(prompt));
    }

    const user = await User.findById(userId);
    const isPremium = user?.premiumStatus?.isPremium || user?.claimedRewards?.includes("streak-7");

    if (mode === "premium" && !isPremium) return res.status(403).json("Premium access required.");

    console.log(">>> Requesting Lunaria Eternal (Mistral)...");

    const systemPrompt = `Task: Lunaria Mindfulness Guidance.
    Input: "${prompt}".
    Identity: You are Lunaria, a compassionate Ancient Zen Guide.
    Format: Return ONLY a valid JSON object. No intro, no outro.
    Structure:
    {
      "analysis": "compassionate reflection (max 20 words)",
      "message": "gentle guidance from Lunaria",
      "metrics": { "essence": "Luminous", "breathDepth": "Deep", "energyCenter": "Heart" },
      "exercise": {
        "name": "Practice Title",
        "posture": "body alignment",
        "visualization": "scene description",
        "steps": [
          {"action": "step 1", "zenWisdom": "insight"},
          {"action": "step 2", "zenWisdom": "insight"},
          {"action": "step 3", "zenWisdom": "insight"},
          {"action": "step 4", "zenWisdom": "insight"},
          {"action": "step 5", "zenWisdom": "insight"}
        ]
      },
      "quote": "wisdom quote"
    }`;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: systemPrompt,
        stream: false,
        options: { temperature: 0.5 }
      })
    });

    if (!response.ok) throw new Error("Ollama connection failed.");

    const data = await response.json();
    const aiResponse = data.response;

    const firstBrace = aiResponse.indexOf('{');
    const lastBrace = aiResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonStr = aiResponse.substring(firstBrace, lastBrace + 1);
      try {
        const result = JSON.parse(jsonStr);
        return res.json({ ...result, mode: "Lunaria Eternal Guide" });
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw Data:", aiResponse);
        throw new Error("Malformed AI response.");
      }
    }

    throw new Error("No JSON found in AI response.");

  } catch (error) {
    console.error("AI Controller Error:", error.message);
    const fallback = generateStandardResponse(req.body.prompt);
    res.json({ ...fallback, mode: "Lunaria Safety Mode" });
  }
};

export const chatWithLunaria = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json("Input required.");

    // 1. Fetch some content from DB to provide context/suggestions
    const keywords = prompt.toLowerCase().split(' ').filter(w => w.length > 3);
    let searchCriteria = {};
    if (keywords.length > 0) {
      searchCriteria = { 
        $or: [
          { title: { $regex: keywords.join('|'), $options: 'i' } },
          { description: { $regex: keywords.join('|'), $options: 'i' } }
        ]
      };
    }

    const suggestions = await Content.find(searchCriteria).limit(3);
    const contextStr = suggestions.map(s => `[${s.type}: ${s.title} (ID: ${s._id})]`).join(', ');

    // 2. Build system prompt for Mistral
    const systemPrompt = `You are Lunaria, a wise and compassionate Ancient Zen Guide.
    User says: "${prompt}"
    Available Content for Recommendation: ${contextStr || "None specifically matching, suggest general mindfulness."}
    
    Task: 
    1. Give 1-2 sentences of compassionate Zen advice.
    2. Recommend 1-2 items from the "Available Content" list above if relevant, otherwise suggest finding a quiet space.
    
    Return ONLY JSON:
    {
      "message": "your advice here",
      "recommendation": "your specific suggestion here",
      "suggestedId": "ID of the most relevant content or null"
    }`;

    // 3. Call Mistral (Ollama)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral",
        prompt: systemPrompt,
        stream: false,
        options: { temperature: 0.7 }
      })
    });

    if (!response.ok) throw new Error("Ollama connection failed.");

    const data = await response.json();
    const aiResponse = data.response;

    const firstBrace = aiResponse.indexOf('{');
    const lastBrace = aiResponse.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonStr = aiResponse.substring(firstBrace, lastBrace + 1);
      const result = JSON.parse(jsonStr);
      return res.json(result);
    }

    res.json({
      message: aiResponse.split('\n')[0],
      recommendation: "Take a deep breath and explore our collection.",
      suggestedId: null
    });

  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    // Fallback to standard response if AI fails
    const fallback = generateStandardResponse(prompt);
    res.json({
      message: fallback.message,
      recommendation: "May you find peace in the simplicity of breath. Try our general mindfulness sessions.",
      suggestedId: null,
      mode: "Lunaria Safety Mode"
    });
  }
};
