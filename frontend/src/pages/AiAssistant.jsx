import { Bot, Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { sendAiMessage } from "../services/aiChatService";

const suggestionChips = [
  "Who owes me money?",
  "This month's earnings",
  "Top customer",
  "Business summary",
  "Pending payments",
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
        <Bot className="text-white" size={16} />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
      </div>
    </div>
  );
}

export default function AiAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `Hi${user?.full_name ? " " + user.full_name.split(" ")[0] : ""}! I'm your AI Business Assistant. Ask me anything about your customers, earnings, or payments.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async (rawText) => {
    const text = rawText.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      const reply = await sendAiMessage(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reach the server just now. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div>
      <PageHeader title="🤖 AI Business Assistant" subtitle="Ask about your customers, earnings, and payments." />

      <Card className="flex flex-col h-[calc(100vh-260px)] min-h-[420px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} className="flex items-end justify-end gap-2">
                <div className="bg-brand-600 text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm max-w-[75%]">
                  {msg.text}
                </div>
                <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
              </div>
            ) : (
              <div key={i} className="flex items-end gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm max-w-[75%]">
                  {msg.text}
                </div>
              </div>
            )
          )}
          {isTyping && <TypingIndicator />}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestionChips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                disabled={isTyping}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200 disabled:opacity-50"
              >
                <Sparkles size={12} className="text-brand-500" />
                {chip}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about your business..."
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="h-10 w-10 shrink-0 rounded-lg bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}