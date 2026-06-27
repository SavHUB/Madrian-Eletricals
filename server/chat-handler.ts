export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const SYSTEM_PROMPT = `You are the assistant for Meridian Electrical, an NICEIC-approved electrical contractor based in Chiswick, West London. Phone: 07956 234 891. NICEIC No: 2203847. Director: James Okafor.

Help visitors with: which electrical service they need, rough pricing, EV charger questions and OZEV grant eligibility, whether Meridian covers their area, how to get a quote or book a survey.

Coverage: W4, W6, W12, W14, SW6, SW13, SW14, TW8, TW9, TW10 postcodes.

Pricing: consumer unit upgrade from £400, full rewire 3-bed typically £2,800-£3,800, EV charger from £650 (OZEV grant up to £350 off — we handle the application), EICR 3-bed from £175, additional circuit from £150.

For EV charger queries: always mention the OZEV grant and that we handle the application — this is a key differentiator.

For emergencies (total power loss, burning smell, exposed wires): call 07956 234 891 immediately.
For gas smell or CO alarm: not electrical — leave the property and call 0800 111 999.

Tone: calm, expert, professional. Under 100 words. Write in sentences not bullet points. End with one clear next step — quote estimator at /quote, survey booking at /contact, or further help.`;

export const FALLBACK_REPLY =
  "Something went wrong — please call us on 07956 234 891.";

/**
 * Generates an assistant reply using the Groq API.
 * Authenticated via the server-side GROQ_API_KEY environment variable,
 * so the key is never exposed to the browser.
 */
export async function generateChatReply(
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 400,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Groq API error ${res.status}: ${detail}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || FALLBACK_REPLY;
}
