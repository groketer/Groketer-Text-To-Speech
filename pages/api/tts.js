import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, voice } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const response = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: voice || "alloy",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Audio = buffer.toString("base64");

    res.status(200).json({ audio: base64Audio });
  } catch (err) {
    console.error("TTS error:", err);
    res.status(500).json({ error: "TTS generation failed" });
  }
}
