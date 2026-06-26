import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `You are the assistant for Meridian Electrical, an NICEIC-approved electrical contractor based in Chiswick, West London. Phone: 07956 234 891. NICEIC No: 2203847. Director: James Okafor.

Help visitors with: which electrical service they need, rough pricing, EV charger questions and OZEV grant eligibility, whether Meridian covers their area, how to get a quote or book a survey.

Coverage: W4, W6, W12, W14, SW6, SW13, SW14, TW8, TW9, TW10 postcodes.

Pricing: consumer unit upgrade from £400, full rewire 3-bed typically £2,800-£3,800, EV charger from £650 (OZEV grant up to £350 off — we handle the application), EICR 3-bed from £175, additional circuit from £150.

For EV charger queries: always mention the OZEV grant and that we handle the application — this is a key differentiator.

For emergencies (total power loss, burning smell, exposed wires): call 07956 234 891 immediately.
For gas smell or CO alarm: not electrical — leave the property and call 0800 111 999.

Tone: calm, expert, professional. Under 100 words. Write in sentences not bullet points. End with one clear next step — quote estimator at /quote, survey booking at /contact, or further help.`;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm the Meridian Electrical assistant. How can I help you today? I can help with pricing, EV chargers, EICR certificates, or booking a survey.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: Message = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          max_tokens: 400,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages,
          ],
        }),
      });
      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "Something went wrong — please call us on 07956 234 891.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong — please call us on 07956 234 891.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-white shadow-lg flex items-center justify-center transition-all"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 flex flex-col rounded-2xl shadow-2xl border border-white/10 overflow-hidden bg-[#0f0f0f]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-amber-500">
            <MessageSquare className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm font-bold text-white">Meridian Electrical</p>
              <p className="text-xs text-amber-100">AI Assistant · Typically replies instantly</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 bg-[#141414]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white"
                      : "bg-white/10 text-white/90"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white/60 rounded-xl px-4 py-2 text-sm">
                  <span className="animate-pulse">Typing…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-3 border-t border-white/10 bg-[#0f0f0f]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
              className="w-9 h-9 flex items-center justify-center bg-amber-500 hover:bg-amber-400 disabled:opacity-40 rounded-xl transition-all"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
