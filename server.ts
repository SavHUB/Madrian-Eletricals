import express from "express";
import dotenv from "dotenv";
import { generateChatReply, FALLBACK_REPLY } from "./server/chat-handler";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const reply = await generateChatReply(Array.isArray(messages) ? messages : []);
    res.json({ reply: reply || FALLBACK_REPLY });
  } catch (err) {
    console.log("[v0] /api/chat error:", err);
    res.status(500).json({ reply: FALLBACK_REPLY });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
