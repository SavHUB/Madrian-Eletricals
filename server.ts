import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: `You are the assistant for Meridian Electrical, an NICEIC-approved electrical contractor based in Chiswick, West London. Phone: 07956 234 891. NICEIC No: 2203847. Director: James Okafor.

Help visitors with: which electrical service they need, rough pricing, EV charger questions and OZEV grant eligibility, whether Meridian covers their area, how to get a quote or book a survey.

Coverage: W4, W6, W12, W14, SW6, SW13, SW14, TW8, TW9, TW10 postcodes.

Pricing: consumer unit upgrade from £400, full rewire 3-bed typically £2,800-£3,800, EV charger from £650 (OZEV grant up to £350 off — we handle the application), EICR 3-bed from £175, additional circuit from £150.

For EV charger queries: always mention the OZEV grant and that we handle the application — this is a key differentiator.

For emergencies (total power loss, burning smell, exposed wires): call 07956 234 891 immediately.
For gas smell or CO alarm: not electrical — leave the property and call 0800 111 999.

Tone: calm, expert, professional. Under 100 words. Write in sentences not bullet points. End with one clear next step — quote estimator at /quote, survey booking at /contact, or further help.`,
          },
          ...messages,
        ],
      }),
    });
    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ||
      "Something went wrong — please call us on 07956 234 891.";
    res.json({ reply });
  } catch {
    res.status(500).json({ reply: "Something went wrong — please call us on 07956 234 891." });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
