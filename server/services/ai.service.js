export const generatePlan = async (profile, exercises) => {
  const prompt = `
You are a professional fitness trainer.

User:
${JSON.stringify(profile)}

Exercises:
${JSON.stringify(exercises)}

Return ONLY JSON:
{
  "warmup": [],
  "main": [],
  "cooldown": []
}
`;

  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false
      })
    });

    const data = await res.json();

    console.log("OLLAMA RAW:", data); // 🔥 debug

    // ❗ FIX QUAN TRỌNG
    if (!data || !data.response) {
      throw new Error("No response from Ollama");
    }

    const output = data.response;

    // 🔥 extract JSON
    let jsonString = output.match(/\{[\s\S]*\}/)?.[0];

    if (!jsonString) throw new Error("No JSON found");

    // 🔥 FIX JSON lỗi (QUAN TRỌNG)
    jsonString = jsonString
      // fix dạng: 10 (per leg) → "10 per leg"
      .replace(/(\d+)\s*\(([^)]+)\)/g, '"$1 $2"')
      // remove newline
      .replace(/\n/g, '')
      // remove trailing commas
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');

    return JSON.parse(jsonString);

  } catch (err) {
    console.log("OLLAMA ERROR:", err.message);

    // 🔥 fallback để không crash
    return {
      warmup: ["Jumping Jack"],
      main: ["Push Up", "Squat"],
      cooldown: ["Stretch"]
    };
  }
};