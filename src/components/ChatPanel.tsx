"use client";

import { useState } from "react";
import { MoreHorizontal, Send } from "lucide-react";

interface Message {
  id: number;
  type: "ai" | "user";
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    type: "ai",
    text: "Hey! I've analyzed your current sequence. Would you like me to suggest some transitions to match the beat?",
    time: "14:02",
  },
  {
    id: 2,
    type: "user",
    text: "Yes, something high-energy for the first cut.",
    time: "14:03",
  },
  {
    id: 3,
    type: "ai",
    text: 'Got it. Applying a "Glitch Kinetic" transition at 00:04. Preview is ready in the timeline.',
    time: "14:03",
  },
  {
    id: 4,
    type: "ai",
    text: "Would you like to try a different text preset for the intro?",
    time: "14:05",
  },
];

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      text: input,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <aside className="fixed right-4 top-[72px] bottom-4 w-[300px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center">
            <span className="text-base">🤖</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a1a]">
              Kinetic Assistant
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[9px] text-emerald-600 font-medium uppercase">
                Online
              </span>
            </div>
          </div>
        </div>
        <button className="text-[#9ca3af] hover:text-[#6b7280]">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2.5 text-[13px] leading-relaxed ${
                  msg.type === "ai"
                    ? "bg-[#f3f4f6] text-[#1a1a1a] rounded-2xl rounded-tl-sm"
                    : "bg-[#1a1a1a] text-white rounded-2xl rounded-tr-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
            <p
              className={`text-[9px] text-[#9ca3af] mt-1 ${msg.type === "user" ? "text-right" : "text-left"}`}
            >
              {msg.time}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI to remix or edit..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1 px-3 py-2 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e11d48]/20 focus:border-[#e11d48]"
          />
          <button
            onClick={handleSend}
            className="w-8 h-8 flex items-center justify-center bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-colors flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
